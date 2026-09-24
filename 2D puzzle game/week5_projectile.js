/* WEEK 5 - Projectile Launch Precision Fix */
(function (global) {
  'use strict';
  var Game = global.Game, M = Game.Matter;
  var Bodies = M.Bodies, Body = M.Body, Composite = M.Composite;
  var Sling = Game.Sling;

  var Shots = Game.Shots = {
    max: 3,
    fired: 0,
    get remaining() { return Shots.max - Shots.fired; },
    reset: function (m) { Shots.max = m || 3; Shots.fired = 0; }
  };

  var Projectile = Game.Projectile = {
    radius: 16,
    speedMultiplier: 0.22,
    minPull: 15,
    state: 'idle',
    active: null,
    snap: null,
    flightFrames: 0,
    calmFrames: 0,
    reset: function () {
      Projectile.active = null;
      Projectile.state = 'idle';
      Projectile.snap = null;
    },
    create: function () {
      var ball = Bodies.circle(Sling.anchor.x, Sling.anchor.y, Projectile.radius, {
        density: 0.005,
        friction: 0.2,
        restitution: 0.3,
        frictionAir: 0.001,
        render: {
          fillStyle: '#e64a19',
          strokeStyle: '#bf360c',
          lineWidth: 3
        }
      });
      Composite.add(Game.world, ball);
      return ball;
    },
    loadNext: function () {
      if (Shots.remaining <= 0) {
        Projectile.state = 'exhausted';
        return null;
      }
      var ball = Projectile.create();
      Sling.attach(ball);
      Projectile.state = 'ready';
      return ball;
    },
    launch: function (release, ball) {
      if (Projectile.state !== 'ready' || release.length < Projectile.minPull) return;

      var vx = (Sling.anchor.x - ball.position.x) * Projectile.speedMultiplier;
      var vy = (Sling.anchor.y - ball.position.y) * Projectile.speedMultiplier;
      var offset = { x: ball.position.x - Sling.anchor.x, y: ball.position.y - Sling.anchor.y };

      Sling.detach();
      Body.setVelocity(ball, { x: vx, y: vy });

      Shots.fired++;
      Projectile.active = ball;
      Projectile.state = 'flying';
      Projectile.flightFrames = 0;
      Projectile.calmFrames = 0;

      Projectile.snap = {
        current: offset,
        velocity: { x: -offset.x * 0.35, y: -offset.y * 0.35 },
        active: true
      };
    },
    updateSnap: function () {
      if (!Projectile.snap || !Projectile.snap.active) return;
      var s = Projectile.snap;
      s.velocity.x += -s.current.x * 0.25;
      s.velocity.y += -s.current.y * 0.25;
      s.velocity.x *= 0.7;
      s.velocity.y *= 0.7;
      s.current.x += s.velocity.x;
      s.current.y += s.velocity.y;

      Sling.bandOverride = { x: Sling.anchor.x + s.current.x, y: Sling.anchor.y + s.current.y };
      if (Math.hypot(s.current.x, s.current.y) < 1.5) {
        Projectile.snap.active = false;
        Sling.bandOverride = null;
      }
    },
    updateFlight: function () {
      if (Projectile.state !== 'flying' || !Projectile.active) return;
      Projectile.flightFrames++;

      if (Projectile.active.speed < 0.25) Projectile.calmFrames++;
      else Projectile.calmFrames = 0;

      var isOutOfBounds = Projectile.active.position.x > Game.width + 100 || Projectile.active.position.x < -100;

      if (Projectile.calmFrames >= 40 || Projectile.flightFrames >= 500 || isOutOfBounds) {
        Projectile.active = null;
        Projectile.loadNext();
      }
    }
  };

  Game.onInit(function () {
    Sling.releaseHandlers.push(Projectile.launch);
  });
  Game.onUpdate(function () {
    Projectile.updateSnap();
    Projectile.updateFlight();
  });
})(window);