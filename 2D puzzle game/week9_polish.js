/* WEEK 9 - Precise Trajectory Dots & Visual FX */
(function (global) {
  'use strict';
  var Game = global.Game;

  function drawTrajectory(ctx) {
    if (Game.State && Game.State.status !== 'playing') return;
    var sling = Game.Sling;
    if (!sling || !sling.drag.active || !sling.ball) return;

    var start = sling.ball.position;
    var pull = sling.drag.vector;
    var len = Math.hypot(pull.x, pull.y);
    if (len < 15) return;

    var speedMultiplier = Game.Projectile ? Game.Projectile.speedMultiplier : 0.22;
    var launchSpeed = len * speedMultiplier;
    var angle = Math.atan2(pull.y, pull.x);

    var vx = Math.cos(angle) * launchSpeed;
    var vy = Math.sin(angle) * launchSpeed;
    
    var currX = start.x;
    var currY = start.y;
    
    var gravity = Game.engine.gravity.y * Game.engine.gravity.scale * (1000 / 60) * (1000 / 60);

    ctx.save();
    ctx.fillStyle = '#ffffff';

    for (var i = 0; i < 35; i++) {
      currX += vx;
      currY += vy;
      vy += gravity;

      if (i % 2 === 0) {
        ctx.beginPath();
        ctx.arc(currX, currY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  var Particles = Game.Particles = {
    pool: [],
    spawn: function (x, y) {
      for (var i = 0; i < 6; i++) {
        Particles.pool.push({
          x: x, y: y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1
        });
      }
    },
    update: function () {
      for (var i = Particles.pool.length - 1; i >= 0; i--) {
        var p = Particles.pool[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.05;
        if (p.life <= 0) Particles.pool.splice(i, 1);
      }
    },
    draw: function (ctx) {
      ctx.save();
      ctx.fillStyle = '#ff9800';
      Particles.pool.forEach(function (p) { ctx.fillRect(p.x, p.y, 3, 3); });
      ctx.restore();
    }
  };

  Game.onUpdate(Particles.update);
  Game.onRender(function (ctx) { drawTrajectory(ctx); }, 15);
  Game.onRender(function (ctx) { Particles.draw(ctx); }, 30);
})(window);