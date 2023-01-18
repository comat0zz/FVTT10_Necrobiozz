export class BaseItemSheet extends ItemSheet {
  
  /** @override */
  get template() {
    return `${game.system_path}/templates/sheets/items/${this.item.type}-sheet.hbs`;
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