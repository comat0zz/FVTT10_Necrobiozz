import { WeaponItemSheet } from "./sheets/WeaponItemSheet.js";
import { ArmorItemSheet } from "./sheets/ArmorItemSheet.js";
import { EquipmentItemSheet } from "./sheets/EquipmentItemSheet.js";
import { InjuriesItemSheet } from "./sheets/InjuriesItemSheet.js";

const itemMappingsSheets = {
  weapon: WeaponItemSheet, 
  armor: ArmorItemSheet, 
  equipment: EquipmentItemSheet, 
  injuries: InjuriesItemSheet
}

/**
 * Polymorphic base class.
 * Should be fairly empty, only containing functionality that all items should have regardless of type.
 * https://foundryvtt.wiki/en/development/guides/polymorphism-actors-items
 */
export const ProxyItemSheet = new Proxy(function () {}, {
  //Will intercept calls to the "new" operator
  construct: function (target, args) {
    const [data] = args;

    //Handle missing mapping entries
    if (!itemMappingsSheets.hasOwnProperty(data.type))
      throw new Error("Unsupported Entity type for create(): " + data.type);

    //Return the appropriate, actual object from the right class
    return new itemMappingsSheets[data.type](...args);
  },

  //Property access on this weird, dirty proxy object
  get: function (target, prop, receiver) {
    switch (prop) {
      case "create":
      case "createDocuments":
        //Calling the class' create() static function
        return function (data, options) {
          if (data.constructor === Array) {
            //Array of data, this happens when creating Items imported from a compendium
            return data.map(i => Item.create(i, options));
          }

          if (!itemMappingsSheets.hasOwnProperty(data.type))
            throw new Error("Unsupported Entity type for create(): " + data.type);

          return itemMappingsSheets[data.type].create(data, options);
        };

      case Symbol.hasInstance:
        //Applying the "instanceof" operator on the instance object
        return function (instance) {
          return Object.values(itemMappingsSheets).some(i => instance instanceof i);
        };

      default:
        //Just forward any requested properties to the base Item class
        return Item[prop];
    }
  },

});