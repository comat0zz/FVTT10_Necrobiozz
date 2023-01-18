import { BaseItemSheet } from "../BaseItemSheet.js";

export class EquipmentItemSheet extends BaseItemSheet {
  
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [game.system.id, "sheet", "item", "item-equipment"],
      width: 520,
      height: 410,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "properties"}]
    });
  }

}