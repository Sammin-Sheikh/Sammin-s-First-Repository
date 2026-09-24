/* WEEK 3 - Destructible Structures */
(function (global) {
  'use strict';
  var Game = global.Game, M = Game.Matter;
  Game.Structures = {
    createWoodBlock: function (x, y, w, h, density) {
      return M.Bodies.rectangle(x, y, w, h, {
        density: density || 0.002, friction: 0.5, restitution: 0.1,
        render: { fillStyle: '#d7ccc8', strokeStyle: '#8d6e63', lineWidth: 2 }
      });
    },
    buildPyramid: function (startX, startY, heavy) {
      var d = heavy ? 0.004 : 0.002;
      var blocks = [];
      blocks.push(Game.Structures.createWoodBlock(startX, startY, 20, 80, d));
      blocks.push(Game.Structures.createWoodBlock(startX + 90, startY, 20, 80, d));
      blocks.push(Game.Structures.createWoodBlock(startX + 45, startY - 50, 110, 20, d));
      M.Composite.add(Game.world, blocks);
      return blocks;
    },
    buildFortress: function (startX, startY) {
      var blocks = [];
      // Double layered fortress walls
      blocks.push(Game.Structures.createWoodBlock(startX, startY, 20, 100, 0.005));
      blocks.push(Game.Structures.createWoodBlock(startX + 100, startY, 20, 100, 0.005));
      blocks.push(Game.Structures.createWoodBlock(startX + 50, startY - 60, 120, 25, 0.005));
      blocks.push(Game.Structures.createWoodBlock(startX + 50, startY - 115, 20, 80, 0.003));
      blocks.push(Game.Structures.createWoodBlock(startX + 50, startY - 165, 90, 20, 0.003));
      M.Composite.add(Game.world, blocks);
      return blocks;
    }
  };
})(window);