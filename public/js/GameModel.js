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
}(['./ObjectsFactory', './GameObject', './config', './mixins', './Player', './Bullet', './History'],
  function(ObjectsFactory, GameObject, config, mixins, Player, Bullet, History){

  function GameModel() {
    this.state = new GameState();

    this._isMaster = true;
    this._history = new History(config.HISTORY_DEPTH);

    this.projectedTime = 0;
  }

  GameModel.prototype.setSlaveMode = function() {
    this._isMaster = false;

    // Activate this if simulation is too heavy (only projects)
    this.step = this._project;
  };

  GameModel.prototype.setMastrerMode = function() {
    this._isMaster = true;
    this.step = this._simulate;
  };


  /* Makes the simulation move forward by dt */
  GameModel.prototype._simulate = function(dt) {
    if (dt < 0) throw new Error('In an isolated system, entropy can only increase');

    // movement
    this._move(dt);
    // collisions
    this._resolveCollisions();

    // Saving snapshot
    if (this._isMaster) {
      this.state.setTimestamp();
      this._history.add(this.state.takeSnapshot());
    } else {
      this.projectedTime += dt;
    }
  };

  /* Projects the simulation by dt time in the future without actually computing it */
  GameModel.prototype._project = function(dt) {
    this._move(dt);
    this.projectedTime += dt;
  };

  GameModel.prototype.step = GameModel.prototype._simulate;

  /*
    Updates the model with a diff.
  */
  GameModel.prototype.update = function(diff) {
    var snap = this._history.get(diff.from);
    if (snap == null) {
      console.error("dropped !");
      return;
    }
    this.state.applySnapshot(snap);
    this.state.applyDiff(diff);
    this._history.add(this.state.takeSnapshot());

    if (!this._isMaster) {
      this._compensateUpdateLagg();
    }
  };

  // Returns a snapshot for the provided timestamp
  GameModel.prototype.getSnapshot = function(timestamp) {
    return this._history.get(timestamp);
  };

  GameModel.prototype.setState = function (newState) {
    this.state = newState;
  };

  GameModel.prototype.setStateFromSnapshot = function (snap) {
    this.state.applySnapshot(snap);
    this._history.add(snap);

    if (!this._isMaster) {
      this._compensateUpdateLagg();
    }
  };

  GameModel.prototype.getState = function() {
    return this.state;
  };

  GameModel.prototype.addPlayer = function(player) {
    this.state.addPlayer(player);
  };

  GameModel.prototype.removePlayer = function(player) {
    this.state.removePlayer(player);
  };

  GameModel.prototype.removePlayerId = function(id) {
    this.state.removePlayerId(id);
  };

  GameModel.prototype.getPlayers = function() {
    return this.state.players;
  };

  GameModel.prototype.getPlayer = function(id) {
    return this.state.players[id];
  };

  GameModel.prototype.addBullet = function(bullet) {
    this.state.addBullet(bullet);
  };

  GameModel.prototype.getBullets = function() {
    return this.state.bullets;
  };

  // Some updates take more time to arrive. This compensates for it.
  // But it may get out of sync and project into the future...
  // Better solution : low-pass filter the delta between updates time and projected time
  // So that the latter follows the former without bursts.
  GameModel.prototype._compensateUpdateLagg = function() {
    var delta = this.projectedTime - this.state.timestamp;
    this.projectedTime = this.state.timestamp;
    if (delta > 0) {

      var it = parseInt(delta / 30);
      var r = delta % 30;

      for (var i = 0 ; i < it ; i++) {
        this.step(30);
      }
      if (r != 0) {
        this.step(r);
      }
    }
  };

  GameModel.prototype._move = function(dt) {
    for (var i in this.state.players) {
      this.state.players[i].update(dt);
    }
    for (var i in this.state.bullets) {
      this.state.bullets[i].move(dt);
    }
  };

  GameModel.prototype._resolveCollisions = function() {

    // First check players boundaries
    for (var i in this.state.players) {
      b = this.state.players[i].attrs;
      if (b.x < 0) b.x = 0;
      else if (b.x > config.WORLD_WIDTH) b.x = config.WORLD_WIDTH;

      if (b.y < 0) b.y = 0;
      else if (b.y > config.WORLD_HEIGHT) b.y = config.WORLD_HEIGHT;
    }

    // The classic shitty O(n^2) algorithm for collision resolution
    var b;
    for (var i in this.state.bullets) {
      b = this.state.bullets[i];
      if (b.attrs.x > config.WORLD_WIDTH || b.attrs.x < 0 ||
        b.attrs.y > config.WORLD_HEIGHT || b.attrs.y < 0) {
        this.state.removeBulletId(i);
      } else {
        for (var j in this.state.players) {
          if (!this.state.players[j].isDead() && this.state.players[j].distanceTo(b) < config.PLAYER_HIT_RADIUS) {
            this.state.players[j].hit(b);

            this.state.removeBulletId(i);
            break;
          }
        }
      }
    }
  };

  /*
    Represents instantaneous state of the Game. Contains real instances of players & bullets.
    Generates JSON data with takeSnapshot and makeDiff.
    Is mutable, never returns a new instance.
  */
  function GameState() {
    this.players = {};
    this.bullets = {};
    this.timestamp = 0;
  }

  GameState.prototype.applySnapshot = function(snap) {

    this.timestamp = snap.timestamp;

    var newPlayers = {};
    for (var i in snap.players) {
      if (this.players[i] === undefined) {
        newPlayers[i] = new Player(snap.players[i]);
      } else {
        newPlayers[i] = this.players[i].setAttributes(snap.players[i]);
      }
    }
    // Garbage
    this.players = newPlayers;

    var newBullets = {};
    for (var i in snap.bullets) {
      if (this.bullets[i] === undefined) {
        newBullets[i] = new Bullet(snap.bullets[i]);
      } else {
        newBullets[i] = this.bullets[i].setAttributes(snap.bullets[i]);
      }
    }
    // Garbage
    this.bullets = newBullets;
  };

  GameState.prototype.takeSnapshot = function() {
    var snap = {
      players: {},
      bullets: {},
      timestamp: this.timestamp
    };

    for (var i in this.players) {
      snap.players[i] = this.players[i].dumpAttributes();
    }

    for (var i in this.bullets) {
      snap.bullets[i] = this.bullets[i].dumpAttributes();
    }

    return snap;
  };

  GameState.prototype.makeDiff = function(snap) {
    var attrsDiff;

    var diff = {
      from: snap.timestamp,
      to: this.timestamp,

      newPlayers: [],
      delPlayers: [],
      players: {},

      newBullets: [],
      delBullets: [],
      bullets: {}
    };

    // Players
    for (var i in snap.players) {
      // A -> (delete)
      if (this.players[i] === undefined) {
        diff.delPlayers.push(i);
      }
      // A -> B
      else {
        attrsDiff = this.players[i].makeAttrsDiff(snap.players[i]);
        if (Object.keys(attrsDiff).length !== 0) {
          diff.players[i] = attrsDiff;
        }
      }
    }

    for (var i in this.players) {
      // (new) -> B
      if (snap.players[i] === undefined ) {
        diff.newPlayers.push(this.players[i].attrs);
      }
    }

    // Bullets
    for (var i in snap.bullets) {
      // A -> (delete)
      if (this.bullets[i] === undefined) {
        diff.delBullets.push(i);
      }
      // A -> B
      else {
        attrsDiff = this.bullets[i].makeAttrsDiff(snap.bullets[i]);
        if (Object.keys(attrsDiff).length !== 0) {
          diff.bullets[i] = attrsDiff;
        }
      }
    }

    for (var i in this.bullets) {
      // (new) -> B
      if (snap.bullets[i] === undefined ) {
        diff.newBullets.push(this.bullets[i].attrs);
      }
    }

    return diff;
  };

  GameState.prototype.applyDiff = function(diff) {
    var id;

    this.timestamp = diff.to;

    // Players
    for (var i in diff.newPlayers) {
      id = diff.newPlayers[i].id;
      if (this.players[id] === undefined) {
        this.players[id] = new Player(diff.newPlayers[i]);
      } else {
        this.players[id].setAttributes(diff.newPlayers[i]);
      }
    }
    for (var i in diff.delPlayers) {
      delete this.players[diff.delPlayers[i]];
    }
    for (var i in diff.players) {
      this.players[i].setAttributes(diff.players[i]);
    }

    //Bullets
    for (var i in diff.newBullets) {
      id = diff.newBullets[i].id;
      if (this.bullets[id] === undefined) {
        this.bullets[id] = new Bullet(diff.newBullets[i]);
      } else {
        this.bullets[id].setAttributes(diff.newBullets[i]);
      }
    }
    for (var i in diff.delBullets) {
      delete this.bullets[diff.delBullets[i]];
    }
    for (var i in diff.bullets) {
      this.bullets[i].setAttributes(diff.bullets[i]);
    }
  };


  GameState.prototype.addPlayer = function(player) {
    this.players[player.attrs.id] = player;
  };

  GameState.prototype.removePlayer = function(player) {
    delete this.players[player.attrs.id];
  };

  GameState.prototype.removePlayerWithId = function(id) {
    delete this.players[id];
  };

  GameState.prototype.addBullet = function(bullet) {
    this.bullets[bullet.attrs.id] = bullet;
  };

  GameState.prototype.removeBullet = function(bullet) {
    delete this.bullets[bullet.attrs.id];
  };

  GameState.prototype.removeBulletId = function(id) {
    delete this.bullets[id];
  };

  GameState.prototype.setTimestamp = function() {
    this.timestamp = Date.now();
  };

  return GameModel;
}));
