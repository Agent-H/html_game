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
}(['config'], function(config){

  function GameView(canvas, model) {
    this.ctx = canvas.getContext('2d');

    this.model = model;
    this.player = null;
  }

  GameView.prototype.setPlayer = function(player) {
    this.player = player;
  };

  GameView.prototype.render = GameView.prototype.step = function() {
    var model = this.model;
    var ctx = this.ctx;

    var players = model.getPlayers();
    var bullets = model.getBullets();
    var p;

    // Clear screen
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, config.WORLD_WIDTH, config.WORLD_HEIGHT);


    ctx.fillStyle = '#f00';
    for (var i in players) {
      if (!players[i].isDead() &&
        (this.player === undefined || players[i].attrs.id != this.player.attrs.id)) {
        this.drawArrow(players[i].attrs, ctx);
      }
    }

    ctx.fillStyle = '#ff0';
    for (var i in bullets) {
      p = bullets[i].attrs;

      ctx.fillRect(p.x, p.y, 2, 2);
    }


    this.drawPlayer(ctx);
  };

  GameView.prototype.drawArrow = function(p, ctx) {
    ctx.save();

    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(-5, 3);
    ctx.lineTo(-5, -3);
    ctx.lineTo(5, 0);
    ctx.fill();

    ctx.restore();
  };

  GameView.prototype.drawPlayer = function(ctx) {
    if (this.player === null) {
      ctx.fillStyle = '#ff0';
      ctx.font = "20pt Arial";
      ctx.fillText("Press j to join.", 250, 200);
    } else if (this.player.isDead()) {
      ctx.fillStyle = '#ff0';
      ctx.font = "20pt Arial";
      ctx.fillText("You are dead.", 300, 200);
      ctx.fillText("Press j to join.", 250, 300);
    } else {
      var p = this.player.attrs;

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
