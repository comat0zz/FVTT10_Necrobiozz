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

}