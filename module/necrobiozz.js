import {Necrobiozz} from "./config.js";

import NecrobiozzActor from "./Actor.js";
import NecrobiozzActorSheet from "./ActorSheet.js";
import NecrobiozzItem from "./Item.js";
import NecrobiozzItemSheet from "./ItemSheet.js";

import { registerSettings } from "./settings.js";

async function preloadHandlebarsTemplates(){
  const templatePath = [
      "systems/FVTT10_Necrobiozz/templates/item-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/item-injuries-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/item-armor-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/item-equipment-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/item-weapon-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/actor-hero-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/actor-enemy-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/chat-weapon-roll.hbs",
      "systems/FVTT10_Necrobiozz/templates/dialog-attrs-roll.hbs",
      "systems/FVTT10_Necrobiozz/templates/chat-attrs-roll.hbs"      
  ];
  return loadTemplates(templatePath); 
}

Hooks.once("init", function () {
  console.log("Necrobiozz TTRPG | init system");

  CONFIG.Necrobiozz = Necrobiozz;
  CONFIG.Item.documentClass = NecrobiozzItem;
  CONFIG.Actor.documentClass = NecrobiozzActor;

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(game.system.id, NecrobiozzItemSheet, {
    types: [
      "equipment",
      "armor",
      "weapon",
      "injuries"
    ],
    makeDefault: true
  });

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(game.system.id, NecrobiozzActorSheet, {
    types: [
      "hero",
      "enemy"
    ],
    makeDefault: true 
  });

  Handlebars.registerHelper('lzCc', function (str, val) {
    return game.i18n.localize(str + val);
  });

  // if equal
  Handlebars.registerHelper('ife', function (v1, v2, options) {
    if (v1 === v2) return options.fn(this);
    else return options.inverse(this);
  });

  Handlebars.registerHelper('ifgt', function (v1, v2, options) {
    if (v1 > v2) return options.fn(this);
    else return options.inverse(this);
  });

  // Pre-load HTML templates
  preloadHandlebarsTemplates();
  registerSettings();
});