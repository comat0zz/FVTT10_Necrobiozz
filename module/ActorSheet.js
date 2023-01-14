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
      width: 900,
      height: 800
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

    console.log(context)
    return context;
  }

  /** @override */
  _onDrop(evt) { 
    evt.preventDefault();
    const dragData = JSON.parse(evt.dataTransfer.getData("text/plain"));
    if(dragData.type != "Item") return;

    var item_id = dragData.uuid.replace("Item.", "");
    var item =  game.items.get(item_id);
    let equips = this.actor.system.equips;
    console.log(item)
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