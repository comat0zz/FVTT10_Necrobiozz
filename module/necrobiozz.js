import {Necrobiozz} from "./config.js";

import NecrobiozzActor from "./Actor.js";
import NecrobiozzActorSheet from "./ActorSheet.js";
import NecrobiozzItem from "./Item.js";
import NecrobiozzItemSheet from "./ItemSheet.js";

import { registerSettings } from "./settings.js";

async function preloadHandlebarsTemplates(){
  const templatePath = [
      "systems/FVTT10_Necrobiozz/templates/item-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/item-armor-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/item-equipment-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/item-weapon-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/actor-hero-sheet.hbs",
      "systems/FVTT10_Necrobiozz/templates/actor-enemy-sheet.hbs"
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
      "weapon"
    ],
    makeDefault: true
  });

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(game.system.id, NecrobiozzActorSheet, {
    makeDefault: true 
  });

  // Pre-load HTML templates
  preloadHandlebarsTemplates();
  registerSettings();
});