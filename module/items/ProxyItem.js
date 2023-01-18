import { WeaponItem } from "./types/WeaponItem.js";
import { ArmorItem } from "./types/ArmorItem.js";
import { EquipmentItem } from "./types/EquipmentItem.js";
import { InjuriesItem } from "./types/InjuriesItem.js";

const itemMappings = {
  weapon: WeaponItem, 
  armor: ArmorItem, 
  equipment: EquipmentItem, 
  injuries: InjuriesItem
}

/**
 * Polymorphic base class.
 * Should be fairly empty, only containing functionality that all items should have regardless of type.
 * https://foundryvtt.wiki/en/development/guides/polymorphism-actors-items
 */
export const ProxyItem = new Proxy(function () {}, {
  //Will intercept calls to the "new" operator
  construct: function (target, args) {
    const [data] = args;

    //Handle missing mapping entries
    if (!itemMappings.hasOwnProperty(data.type))
      throw new Error("Unsupported Entity type for create(): " + data.type);

    //Return the appropriate, actual object from the right class
    return new itemMappings[data.type](...args);
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

          if (!itemMappings.hasOwnProperty(data.type))
            throw new Error("Unsupported Entity type for create(): " + data.type);

          return itemMappings[data.type].create(data, options);
        };

      case Symbol.hasInstance:
        //Applying the "instanceof" operator on the instance object
        return function (instance) {
          return Object.values(itemMappings).some(i => instance instanceof i);
        };

      default:
        //Just forward any requested properties to the base Item class
        return Item[prop];
    }
  },

});