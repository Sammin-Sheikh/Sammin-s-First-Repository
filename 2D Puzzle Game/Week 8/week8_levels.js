/* WEEK 8 - Multi-level Design & Increased Difficulty */
(function (global) {
  'use strict';
  var Game = global.Game, M = Game.Matter;

  Game.Levels = {
    maxLevel: 3,
    clearWorld: function () {
      if (!Game.world) return;
      var allBodies = M.Composite.allBodies(Game.world);
      var dynamicBodies = allBodies.filter(function (b) {
        return !b.isStatic;
      });
      dynamicBodies.forEach(function (b) {
        M.Composite.remove(Game.world, b);
      });
      if (Game.Targets) Game.Targets.clear();
    },
    load: function (lvl) {
      Game.Levels.clearWorld();
      Game.State.levelNumber = lvl;
      Game.State.status = 'playing';
      if (Game.State.checkTimer) {
        clearTimeout(Game.State.checkTimer);
        Game.State.checkTimer = null;
      }

      Game.Sling.anchor = { x: 180, y: 430 };

      if (lvl === 1) {
        // Level 1: Standard Single Tower
        Game.Shots.reset(3);
        Game.Structures.buildPyramid(700, 500, false);
        Game.Targets.createPig(745, 430, 18, 20, false);
      } else if (lvl === 2) {
        // Level 2: Harder - Dual Reinforced Towers with protected targets
        Game.Shots.reset(3);
        Game.Structures.buildPyramid(640, 500, true);
        Game.Structures.buildPyramid(780, 500, true);
        
        Game.Targets.createPig(685, 430, 16, 35, false);
        Game.Targets.createPig(825, 430, 16, 35, false);
      } else if (lvl === 3) {
        // Level 3: Expert Boss Fortress - Triple reinforced fortresses & tough boss targets
        Game.Shots.reset(4); // 4 shots for a bigger level
        Game.Structures.buildFortress(550, 520);
        Game.Structures.buildFortress(730, 520);

        Game.Targets.createPig(600, 420, 15, 45, true);
        Game.Targets.createPig(780, 420, 15, 45, true);
      }

      Game.Projectile.reset();
      Game.Projectile.loadNext();
    }
  };
})(window);