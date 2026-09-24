/* WEEK 2 - Environment & Bounds */
(function (global) {
  'use strict';
  var Game = global.Game, M = Game.Matter;
  Game.onInit(function () {
    var ground = M.Bodies.rectangle(512, 580, 1024, 40, { isStatic: true, render: { fillStyle: '#2e7d32' } });
    var wallLeft = M.Bodies.rectangle(-10, 300, 20, 600, { isStatic: true });
    var wallRight = M.Bodies.rectangle(1034, 300, 20, 600, { isStatic: true });
    M.Composite.add(Game.world, [ground, wallLeft, wallRight]);
  });
})(window);