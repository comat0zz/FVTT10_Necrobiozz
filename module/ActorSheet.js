import { genId } from "./utils.js";

/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export default class NecrobiozzActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["necrobiozz", "sheet", "actor"],
      width: 720,
      height: 800,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "weaponequip"}]
    });
  }

  /** @override */
  get template() {
    return `systems/FVTT10_Necrobiozz/templates/actor-${this.actor.type}-sheet.hbs`;
  }

  /** @inheritdoc */
  getData(options) {
    const context = super.getData(options);

    context.systemData = context.data.system;
    context.config = CONFIG.Necrobiozz;

    context.isWeapons = context.systemData.equips.filter((i) => i.type === "weapon");
    context.isArmor = context.systemData.equips.filter((i) => i.type === "armor");
    context.isEquip = context.systemData.equips.filter((i) => i.type === "equipment");
    context.isInjury = context.systemData.equips.filter((i) => i.type === "injuries");

    console.log(context)
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.actor-roll-weapon').click(evt => this._onActorRollWeapon(evt));
    html.find('.actor-roll-attrs').click(evt => this._onActorRollAttrs(evt));

    html.find('.equip-item-del').click(evt => this._onEquipItemDel(evt));
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  async _onActorRollWeapon(evt) {
    evt.preventDefault();
    const weapon_id = $(evt.currentTarget).closest('tr').attr('item-id');
    const item = this.actor.system.equips.filter((i) => i.type === "weapon" && i.id == weapon_id);
    const oItem = game.items.get(item[0].item_id);
    
    // Порог травмы, по умолчанию 1
    let threshold = 1;

    if(oItem.system.props.isTraumatic) {
      threshold = oItem.system.props.valTraumatic;
    }

    let roll = await new Roll(item[0].damage).roll({async: true});
    
    let isInjury = false;
    let injury = {};
    if(roll.total >= threshold) {
      isInjury = true;
      const injuries = game.items.filter((i) => i.type === "injuries");
      const lenInj = injuries.length - 1;
      injury = injuries[this.getRandomInt(0,lenInj)];
    }

    const html = await renderTemplate("systems/FVTT10_Necrobiozz/templates/chat-weapon-roll.hbs", {
      item_name: item[0].name,
      img: item[0].img,
      dice: item[0].damage,
      distance: CONFIG.Necrobiozz.Distance[oItem.system.distance],
      desc: oItem.system.description,
      threshold: threshold,
      result: roll.result,
      total: roll.total,
      isInjury: isInjury,
      injury: injury,
      isAmmo: oItem.system.props.isAmmo // TODO: Сделать проверку патронов
    });

    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: html
    });
  }

  async checkAttr(attr, html) {
    
    const actor_min = this.actor.system.attrs[attr].curr;
    const actor_max = this.actor.system.attrs[attr].max;

    const dices = html.find(`form input[name=count_dices]`).val();
    const mod = html.find(`form input[type=radio][name=modificator]:checked`).val();

    let roll = await new Roll(`${dices}d20`).evaluate({async: true});
    let sortedResults = roll.terms[0].results.map(r => {return r.result}).sort(function(a, b) {
      return b - a;});
    
      const tpl = await renderTemplate("systems/FVTT10_Necrobiozz/templates/chat-attrs-roll.hbs", {
        terms: `${dices}d20`,
        row: sortedResults.join(', '),
        rmax: parseInt(sortedResults[0]),
        rmin: parseInt(sortedResults.slice(-1)),
        attr: attr,
        mod: mod,
        actor_min: parseInt(actor_min),
        actor_max: parseInt(actor_max),
        attrLabel: CONFIG.Necrobiozz.Attrs[attr]
      });
  
    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker(),
        content: tpl
    });
  }

  async _onActorRollAttrs(evt) {
    evt.preventDefault();
    const attrType = $(evt.currentTarget).attr('attr-type'); 

    const template = await renderTemplate("systems/FVTT10_Necrobiozz/templates/dialog-attrs-roll.hbs");
    return new Promise(resolve => {
      const data = {
        title: game.i18n.localize("nkrbz.Common.CheckAttrs"),
        content: template,
        buttons: {
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize("nkrbz.Common.Buttons.Cancel"),
            callback: html => resolve({cancelled: true})
          },
          yes: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize("nkrbz.Common.Select.Yes"),
            callback: html => resolve(this.checkAttr(attrType, html))
           }        
        },
        default: "cancel",
        close: () => resolve({cancelled: true})
      }
      new Dialog(data, null).render(true);
    });
  }

  _onEquipItemDel(evt) {
    evt.preventDefault();
    const item_id = $(evt.currentTarget).closest('tr').attr('item-id'); 
    var equips = duplicate(this.actor.system.equips);
    let newEquips = [];

    equips.forEach(el => {
      if(el.id !== item_id) {
        newEquips.push(el);
      }
    });

    this.actor.update({"data.equips": newEquips});
  }

  /** @override */
  _onDrop(evt) { 
    evt.preventDefault();
    const dragData = JSON.parse(evt.dataTransfer.getData("text/plain"));
    if(dragData.type != "Item") return;

    var item_id = dragData.uuid.replace("Item.", "");
    var item =  game.items.get(item_id);
    let equips = this.actor.system.equips;
    let newItem = {
      "id": genId(),
      "item_id": item_id,
      "name": item.name,
      "img": item.img,
      "type": item.type
    };

    if(item.type == "weapon") {
      newItem.damage = item.system.diceDamage;
    }
    if(item.type == "armor") {
      newItem.survVal = item.system.survVal;
      newItem.isSurval = item.system.isSurval;
    }
    equips.push(newItem);
    this.actor.update({"data.equips": equips});
  }

}