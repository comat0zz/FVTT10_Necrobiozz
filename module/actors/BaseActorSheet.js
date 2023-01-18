export class BaseActorSheet extends ActorSheet {
  /** @override */
  get template() {
    return `${game.system_path}/templates/sheets/actors/${this.actor.type}-sheet.hbs`;
  }
}