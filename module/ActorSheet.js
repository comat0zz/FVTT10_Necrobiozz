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
    html.find('.actor-roll-hand').click(evt => this._onActorRollHand(evt));

    html.find('.equip-item-del').click(evt => this._onEquipItemDel(evt));
  }

  _onActorRollWeapon(evt) {
    evt.preventDefault();
    const weapon_id = $(evt.currentTarget).closest('tr').attr('item-id'); 

  }

  _onActorRollAttrs(evt) {
    evt.preventDefault();
    const attrType = $(evt.currentTarget).attr('attr-type'); 
    console.log(attrType);
    console.log(this.actor.system.attrs[attrType].curr)

  }

  _onActorRollHand(evt) {
    evt.preventDefault();
    

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
    console.log(newItem)

    equips.push(newItem);
    this.actor.update({"data.equips": equips});
  }

}