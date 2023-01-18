import { Necrobiozz } from "./config.js";
import { initializeHandlebars } from "./handlebars.js";
import { registerSettings } from "./settings.js";

import NecrobiozzActor from "./Actor.js";
import NecrobiozzActorSheet from "./ActorSheet.js";
import NecrobiozzItem from "./Item.js";
import NecrobiozzItemSheet from "./ItemSheet.js";

Hooks.once("init", function () {
  console.log(game.system.id + " | init system");

  CONFIG.Necrobiozz = Necrobiozz;
  CONFIG.Item.documentClass = NecrobiozzItem;
  CONFIG.Actor.documentClass = NecrobiozzActor;
  game.system_path = Necrobiozz.system_path;

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
      "named_adversary",
      "simple_adversary",
      "allies"
    ],
    makeDefault: true 
  });

  
  // Pre-load HTML templates
  initializeHandlebars();
  registerSettings();
});