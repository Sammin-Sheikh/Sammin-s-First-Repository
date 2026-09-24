/* WEEK 1 - Core Game Setup */
(function (global) {
  'use strict';
  var M = global.Matter;
  var Game = global.Game = {
    Matter: M, width: 1024, height: 600,
    initCallbacks: [], updateCallbacks: [], renderCallbacks: [],
    onInit: function (cb) { Game.initCallbacks.push(cb); },
    onUpdate: function (cb) { Game.updateCallbacks.push(cb); },
    onRender: function (cb, priority) { Game.renderCallbacks.push({ cb: cb, p: priority || 10 }); }
  };

  Game.engine = M.Engine.create({ gravity: { x: 0, y: 1 } });
  Game.world = Game.engine.world;
  Game.render = M.Render.create({
    element: document.body, engine: Game.engine,
    options: { width: Game.width, height: Game.height, wireframes: false, background: '#87CEEB' }
  });

  M.Render.run(Game.render);
  Game.runner = M.Runner.create();
  M.Runner.run(Game.runner, Game.engine);

  global.addEventListener('load', function () {
    Game.initCallbacks.forEach(function (cb) { cb(); });
    M.Events.on(Game.runner, 'afterUpdate', function () {
      Game.updateCallbacks.forEach(function (cb) { cb(); });
    });
    M.Events.on(Game.render, 'afterRender', function () {
      var ctx = Game.render.context;
      Game.renderCallbacks.sort(function(a,b){return a.p-b.p;}).forEach(function (item) { item.cb(ctx); });
    });
  });
})(window);