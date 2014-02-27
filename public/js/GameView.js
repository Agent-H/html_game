(function(deps, factory){
  if (typeof module === 'object') {
    var modules = [];
    for (var i in deps) {
      modules.push(require(deps[i]));
    }
    module.exports = factory.apply(this, modules);
  } else {
    define(deps, factory);
  }
}(['config', './effectsManager'], function(config, effectsManager){

  function GameView(canvas, model) {
    this.ctx = canvas.getContext('2d');

    this.model = model;
    this.playerId = null;
  }

  GameView.prototype.setPlayerId = function(pid) {
    this.playerId = pid;
  };

  GameView.prototype.render = GameView.prototype.step = function(dt) {
    var model = this.model;
    var ctx = this.ctx;

    var players = model.getPlayers();
    var player = this.model.getPlayer(this.playerId);
    var bullets = model.getBullets();
    var effects = effectsManager.getEffects();
    var p;

    // Clear screen
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, config.WORLD_WIDTH, config.WORLD_HEIGHT);


    // players
    ctx.fillStyle = '#f00';
    for (var i in players) {
      if (!players[i].isDead() && players[i].attrs.id != this.playerId) {
        this.drawLifeBar(players[i].attrs, ctx);
        this.drawArrow(players[i].attrs, ctx);
      }
    }

    // bullets
    ctx.fillStyle = '#ff0';
    for (var i in bullets) {
      p = bullets[i].attrs;

      ctx.fillRect(p.x, p.y, 2, 2);
    }

    // current player
    this.drawPlayer(ctx);

    // effects
    for (var i in effects) {
      effects[i].draw(ctx, dt);
    }

    // UI
    // TODO put hearts here
    this.drawScore(player.attrs.score, ctx);
  };

  GameView.prototype.drawScore = function(s, ctx) {
    ctx.fillStyle = '#ff0';
    ctx.font = "20pt Arial";
    ctx.fillText("Score: "+s, 700, 30);
  };

  GameView.prototype.drawLifeBar = function(p, ctx) {
    ctx.save();

    var sep = (p.lives / config.PLAYER_INITIAL_LIVES) * 30;

    ctx.translate(p.x, p.y);
    ctx.fillStyle = '#0f0';
    ctx.fillRect(-15, -10, sep, 3);
    ctx.fillStyle = '#f00';
    ctx.fillRect(-15 + sep, -10, 30 - sep, 3);

    ctx.restore();
  };

  GameView.prototype.drawArrow = function(p, ctx) {
    ctx.save();

    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(-6, 4);
    ctx.lineTo(-6, -4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  GameView.prototype.drawPlayer = function(ctx) {
    if (this.playerId === null) {
      ctx.fillStyle = '#ff0';
      ctx.font = "20pt Arial";
      ctx.fillText("Press j to join.", 250, 200);
    } else {
      var player = this.model.getPlayer(this.playerId);
      if (player == null || player.isDead()) {
        ctx.fillStyle = '#ff0';
        ctx.font = "20pt Arial";
        ctx.fillText("You are dead.", 300, 200);
        ctx.fillText("Press j to join.", 250, 300);
      } else {
        p = player.attrs;

        ctx.fillStyle = '#00f';
        this.drawArrow(p, ctx);

        ctx.fillStyle = '#c11';
        ctx.strokeStyle = '#faa';
        this.drawHeart(100, 100, ctx);

        for (var i = 0 ; i < config.PLAYER_INITIAL_LIVES ; i++) {
          ctx.beginPath();
          this.drawHeart(i*30+20, 10, ctx);
          if (i < p.lives)
            ctx.fill();
          ctx.stroke();
        }
      }
    }
  };

  GameView.prototype.drawHeart = function(x, y, ctx) {
    ctx.save();

    ctx.translate(x, y);
    ctx.moveTo(0, 0);
    //bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    ctx.bezierCurveTo(-5, -5, -12, -5, -12, 4);
    ctx.bezierCurveTo(-12,10,-5,10,0,20);
    ctx.bezierCurveTo(5, 10, 12, 10, 12, 4);
    ctx.bezierCurveTo(12,-5,5,-5,0,0);

    ctx.restore();
  };

  return GameView;
}));
