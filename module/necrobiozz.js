import { Necrobiozz } from "./config.js";
import { initializeHandlebars } from "./handlebars.js";
import { registerSettings } from "./settings.js";

import { ProxyItemSheet } from "./items/ProxyItemSheet.js";
import { ProxyItem } from "./items/ProxyItem.js";

import { ProxyActorSheet } from "./actors/ProxyActorSheet.js";
import { ProxyActor } from "./actors/ProxyActor.js";

Hooks.once("init", function () {
  console.log(game.system.id + " | init system");

  CONFIG.Necrobiozz = Necrobiozz;
  game.system_path = Necrobiozz.system_path;

  CONFIG.Item.documentClass = ProxyItem;
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(game.system.id, ProxyItemSheet, {
    label: "Necrobiozz.Sheet.Item",
    makeDefault: true
  });

  CONFIG.Actor.documentClass = ProxyActor;
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(game.system.id, ProxyActorSheet, {
    label: "Necrobiozz.Sheet.Actor",
    makeDefault: true 
  });

  
  // Pre-load HTML templates
  initializeHandlebars();
  registerSettings();
});