/* WEEK 7 - Game State, Win/Lose, Start Menu & Next Level Handling */
(function (global) {
  'use strict';
  var Game = global.Game;
  Game.State = {
    status: 'menu', // Starts at main menu
    levelNumber: 1,
    checkTimer: null,
    win: function () {
      if (Game.State.status !== 'playing') return;
      Game.State.status = 'win';
    },
    lose: function () {
      if (Game.State.status !== 'playing') return;
      Game.State.status = 'lose';
    },
    nextLevel: function () {
      if (Game.State.levelNumber < Game.Levels.maxLevel) {
        Game.Levels.load(Game.State.levelNumber + 1);
      } else {
        Game.State.status = 'menu'; // Return to menu if all levels beaten
      }
    },
    restart: function () {
      Game.Levels.load(Game.State.levelNumber);
    },
    update: function () {
      if (Game.State.status !== 'playing') return;

      if (Game.Targets && Game.Targets.list.length === 0) {
        Game.State.win();
      } else if (
        Game.Shots &&
        Game.Shots.remaining === 0 &&
        (!Game.Projectile || !Game.Projectile.active) &&
        Game.Sling &&
        !Game.Sling.ball
      ) {
        if (!Game.State.checkTimer) {
          Game.State.checkTimer = setTimeout(function () {
            Game.State.checkTimer = null;
            if (Game.Targets.list.length > 0) {
              Game.State.lose();
            }
          }, 2000);
        }
      }
    }
  };

  Game.onInit(function () {
    var canvas = Game.render.canvas;
    canvas.addEventListener('click', function (e) {
      if (Game.State.status === 'menu') {
        Game.Levels.load(1);
      } else if (Game.State.status === 'win') {
        Game.State.nextLevel();
      } else if (Game.State.status === 'lose') {
        Game.State.restart();
      }
    });
  });

  Game.onUpdate(Game.State.update);

  Game.onRender(function (ctx) {
    if (Game.State.status === 'menu') {
      // Main Menu Screen
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, Game.width, Game.height);
      ctx.textAlign = 'center';
      
      ctx.fillStyle = '#ff9800';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText('2D PHYSICS PUZZLE GAME', Game.width / 2, Game.height / 2 - 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = '22px sans-serif';
      ctx.fillText('Drag the red bird on the slingshot, aim, and destroy all targets!', Game.width / 2, Game.height / 2 - 10);

      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('CLICK ANYWHERE TO START GAME', Game.width / 2, Game.height / 2 + 60);
      ctx.restore();
      return;
    }

    // HUD Level Display
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Level: ' + Game.State.levelNumber + ' / ' + Game.Levels.maxLevel, 20, 30);
    ctx.fillText('Shots Left: ' + (Game.Shots ? Game.Shots.remaining : 0), 20, 60);
    ctx.restore();

    // Win/Lose Screen Overlays
    if (Game.State.status !== 'playing') {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, Game.width, Game.height);
      ctx.textAlign = 'center';

      if (Game.State.status === 'win') {
        ctx.fillStyle = '#4caf50';
        ctx.font = 'bold 48px sans-serif';
        ctx.fillText('LEVEL COMPLETED!', Game.width / 2, Game.height / 2 - 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px sans-serif';
        ctx.fillText(Game.State.levelNumber < Game.Levels.maxLevel ? 'Click anywhere for Next Level' : 'Click anywhere to Return to Menu', Game.width / 2, Game.height / 2 + 30);
      } else if (Game.State.status === 'lose') {
        ctx.fillStyle = '#e53935';
        ctx.font = 'bold 48px sans-serif';
        ctx.fillText('OUT OF SHOTS!', Game.width / 2, Game.height / 2 - 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px sans-serif';
        ctx.fillText('Click anywhere to Try Again', Game.width / 2, Game.height / 2 + 30);
      }
      ctx.restore();
    }
  }, 100);
})(window);