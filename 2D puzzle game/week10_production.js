/* WEEK 10 - Production Tuning */
(function (global) {
  'use strict';
  var Game = global.Game;
  Game.onInit(function () {
    Game.engine.positionIterations = 10;
    Game.engine.velocityIterations = 8;
  });
})(window);