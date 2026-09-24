/* WEEK 4 - Dynamic Angry Birds Style Slingshot */
(function (global) {
  'use strict';
  var Game = global.Game, M = Game.Matter;

  Game.Sling = {
    anchor: { x: 180, y: 430 },
    ball: null,
    bandOverride: null,
    maxPull: 110,
    drag: { active: false, vector: { x: 0, y: 0 } },
    releaseHandlers: [],
    attach: function (body) {
      Game.Sling.ball = body;
      M.Body.setStatic(body, true);
      M.Body.setPosition(body, Game.Sling.anchor);
      M.Body.setVelocity(body, { x: 0, y: 0 });
      M.Body.setAngularVelocity(body, 0);
    },
    detach: function () {
      if (Game.Sling.ball) {
        M.Body.setStatic(Game.Sling.ball, false);
      }
      Game.Sling.ball = null;
    }
  };

  Game.onInit(function () {
    var canvas = Game.render.canvas;

    function getMousePos(e) {
      var rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    canvas.addEventListener('mousedown', function (e) {
      if (Game.State && Game.State.status === 'menu') return;
      if (!Game.Sling.ball) return;
      var pos = getMousePos(e);
      var ballPos = Game.Sling.ball.position;
      if (Math.hypot(pos.x - ballPos.x, pos.y - ballPos.y) < 50) {
        Game.Sling.drag.active = true;
      }
    });

    window.addEventListener('mousemove', function (e) {
      if (!Game.Sling.drag.active || !Game.Sling.ball) return;
      var pos = getMousePos(e);
      var dx = pos.x - Game.Sling.anchor.x;
      var dy = pos.y - Game.Sling.anchor.y;
      var dist = Math.hypot(dx, dy);
      var angle = Math.atan2(dy, dx);

      var limitedDist = Math.min(dist, Game.Sling.maxPull);
      var newPos = {
        x: Game.Sling.anchor.x + Math.cos(angle) * limitedDist,
        y: Game.Sling.anchor.y + Math.sin(angle) * limitedDist
      };

      M.Body.setPosition(Game.Sling.ball, newPos);
      M.Body.setVelocity(Game.Sling.ball, { x: 0, y: 0 });
      
      Game.Sling.drag.vector = {
        x: Game.Sling.anchor.x - newPos.x,
        y: Game.Sling.anchor.y - newPos.y
      };
    });

    window.addEventListener('mouseup', function () {
      if (!Game.Sling.drag.active) return;
      Game.Sling.drag.active = false;
      var len = Math.hypot(Game.Sling.drag.vector.x, Game.Sling.drag.vector.y);
      var release = { vector: Game.Sling.drag.vector, length: len };
      Game.Sling.releaseHandlers.forEach(function (h) {
        h(release, Game.Sling.ball);
      });
    });
  });

  // Render Slingshot Wood Stand & Back Band
  Game.onRender(function (ctx) {
    var anchor = Game.Sling.anchor;
    var target = Game.Sling.bandOverride || (Game.Sling.ball ? Game.Sling.ball.position : anchor);

    ctx.save();
    ctx.fillStyle = '#4a2c11';
    ctx.fillRect(anchor.x - 8, anchor.y, 16, 120);
    ctx.beginPath();
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#4a2c11';
    ctx.moveTo(anchor.x, anchor.y + 20);
    ctx.lineTo(anchor.x - 18, anchor.y - 15);
    ctx.moveTo(anchor.x, anchor.y + 20);
    ctx.lineTo(anchor.x + 18, anchor.y - 15);
    ctx.stroke();

    ctx.strokeStyle = '#301c0d';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(anchor.x + 15, anchor.y - 12);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
    ctx.restore();
  }, 4);

  // Render Front Band & Leather Pouch
  Game.onRender(function (ctx) {
    var anchor = Game.Sling.anchor;
    var target = Game.Sling.bandOverride || (Game.Sling.ball ? Game.Sling.ball.position : anchor);

    ctx.save();
    ctx.strokeStyle = '#301c0d';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(anchor.x - 15, anchor.y - 12);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();

    if (Game.Sling.ball || Game.Sling.bandOverride) {
      ctx.fillStyle = '#211308';
      ctx.beginPath();
      ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }, 12);
})(window);