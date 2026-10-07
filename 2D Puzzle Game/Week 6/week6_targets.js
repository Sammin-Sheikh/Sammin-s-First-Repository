/* WEEK 6 - Enemy Targets & Collision System */
(function (global) {
  'use strict';
  var Game = global.Game, M = Game.Matter;
  Game.Targets = {
    list: [],
    clear: function () {
      Game.Targets.list.forEach(function (pig) {
        M.Composite.remove(Game.world, pig);
      });
      Game.Targets.list = [];
    },
    createPig: function (x, y, radius, hp, isBoss) {
      radius = radius || 18;
      hp = hp || 20;
      var pig = M.Bodies.circle(x, y, radius, {
        density: isBoss ? 0.003 : 0.001,
        friction: 0.5,
        restitution: 0.3,
        render: { 
          fillStyle: isBoss ? '#8e24aa' : '#4caf50', 
          strokeStyle: isBoss ? '#4a148c' : '#2e7d32', 
          lineWidth: 2 
        },
        plugin: { hp: hp, maxHp: hp }
      });
      Game.Targets.list.push(pig);
      M.Composite.add(Game.world, pig);
      return pig;
    }
  };

  Game.onInit(function () {
    M.Events.on(Game.engine, 'collisionStart', function (evt) {
      evt.pairs.forEach(function (pair) {
        var speedA = M.Vector.magnitude(pair.bodyA.velocity);
        var speedB = M.Vector.magnitude(pair.bodyB.velocity);
        var relativeSpeed = Math.abs(speedA - speedB);

        [pair.bodyA, pair.bodyB].forEach(function (b) {
          if (b.plugin && typeof b.plugin.hp === 'number') {
            if (relativeSpeed > 1.2) {
              b.plugin.hp -= relativeSpeed * 5;
              if (b.plugin.hp <= 0) {
                M.Composite.remove(Game.world, b);
                var idx = Game.Targets.list.indexOf(b);
                if (idx > -1) Game.Targets.list.splice(idx, 1);
              }
            }
          }
        });
      });
    });
  });
})(window);