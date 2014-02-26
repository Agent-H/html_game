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
}(['./Game', './Player'],
  function(game, Player){

    function NPCModule(n) {
      n = n || 0;
      this._nNpcs = n;
      this._npcs = [];
    }

    NPCModule.prototype.step = function(dt) {
      for (var i = 0 ; i < this._npcs.length ; i++) {
        this._npcs[i].step(dt);
      }
    };

    NPCModule.prototype.spawn = function() {
      var bot;

      for (var i = 0 ; i < this._nNpcs ; i++) {
        bot = new NPC(i);
        this._npcs.push(bot);
        game.model.addPlayer(bot.player);
      }
    };


    var THRESHOLD = 0.1;
    var ENGAGE_DIST = 100;
    var SPAWN_DELAY = 2000;
    var RETARGET_DELAY = 500;
    var FIRE_DELAY = 500;

    function NPC(id) {
      this.player = new Player({
        name: 'Bot ' + id
      });
      this.player.reset();
      this._target = null;
      this._targetCounter = 0;
      this._spawnCounter = 0;
      this._fireCounter = 0;
    }

    NPC.prototype.step = function(dt) {
      if (this.player.isDead()) {
        if ((this._spawnCounter+= dt) >= SPAWN_DELAY) {
          this.player.reset();
          this._spawnCounter = 0;
        }
        return;
      }
      if ((this._targetCounter+= dt) >= RETARGET_DELAY) {
        this._targetCounter = 0;
        this.acquireTarget();
      }

      if (this._target == null) {
        this.player.moveForward();
        if (Math.random() > 0.2) {
          this.player.turnLeft();
        } else if (Math.random() > 0.2) {
          this.player.turnRight();
        } else if (Math.random() > 0.1) {
          this.player.fire();
        }
      } else {
        this.attackTarget(dt);
      }
    };

    NPC.prototype.attackTarget = function(dt) {
      var attrs = this.player.attrs;
      var target = game.model.getPlayer(this._target);
      if (target == null || target.isDead())
        return;

      var alpha = Math.atan2(target.attrs.y - attrs.y, target.attrs.x - attrs.x);
      var diff = angleDiff(attrs.angle, alpha);
      var dist = this.player.distanceTo(target);

      this.player.resetControls();

      if (diff > THRESHOLD) {
        this.player.moveForward();
        this.player.turnLeft();
      } else if (diff < -THRESHOLD) {
        this.player.moveForward();
        this.player.turnRight();
      } else {
        if (dist < ENGAGE_DIST) {
          this.player.moveBackward();
        } else if (dist > ENGAGE_DIST) {
          this.player.moveForward();
        }
        if ((this._fireCounter+= dt) >= FIRE_DELAY) {
          this.player.fire();
          this._fireCounter = 0;
        }
      }
    };

    NPC.prototype.acquireTarget = function() {
      var minD = 999999999, minId = null, d = 0;
      var players = game.model.getPlayers();

      for (var i in players) {
        if (i == this.player.attrs.id) continue;

        var d = players[i].distanceTo(this.player);

        if ( d < minD) {
          minId = i;
          minD = d;
        }
      }
      this._target = minId;
    };

    function angleDiff(a1, a2) {
      var diff = a1 - a2;
      while (diff > Math.PI) {
          diff -= 2*Math.PI;
      }
      while (diff < - Math.PI) {
          diff += 2*Math.PI;
      }
      return diff;
    }


    return NPCModule;
  })
);
