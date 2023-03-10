import { BaseActorSheet } from "../BaseActorSheet.js";

/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class AlliesActorSheet extends BaseActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [game.system.id, "sheet", "actor", "actor-allies"],
      width: 720,
      height: 800,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "weaponequip"}]
    });
  }

  /** @inheritdoc */
  getData(options) {
    const context = super.getData(options);

    context.systemData = context.data.system;
    context.config = CONFIG.Necrobiozz;

    console.log(context)
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find('.ally-roll').click(evt => this._onActorRollDmg(evt));
  }

  async _onActorRollDmg(evt) {
    evt.preventDefault();
    const dmg = $(evt.currentTarget).attr('roll-dmg');
    let roll = await new Roll(dmg).roll({async: true});

    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: game.i18n.localize("nkrbz.Actor.AllyAttack") + " ("+ dmg +"): " + roll.result
    });
  }


}