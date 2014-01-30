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
}(['./ObjectsFactory', './GameObject', './config', './mixins', './Player', './Bullet'],
  function(ObjectsFactory, GameObject, config, mixins, Player, Bullet){

  function GameModel() {
    this.state = new GameState();
  }


  /* Makes the simulation move forward by dt */
  GameModel.prototype.simulate = function(dt) {
    if (dt < 0) throw new Error('In an isolated system, entropy can only increase');

    // movement
    this._move(dt);
    // collisions
    this._resolveCollisions();
  };

  /* Projects the simulation by dt time in the future without actually computing it */
  GameModel.prototype.project = function(dt) {
    this._move(dt);
  };

  GameModel.prototype.step = GameModel.prototype.simulate;

  /*
    Updates the model with a diff.
    /!\ Expects diff "from" timestamp to match current frame timestamp
  */
  GameModel.prototype.update = function(diff) {
    if (diff.from !== this.getLastFrame().timestamp) {
      throw new Error('Diff should only diff with last frame.');
    }

    throw new Error('Not yet implemented');
  };

  // Returns the frame at the given timestamp or null otherwise
  GameModel.prototype.getFrame = function(timestamp) {
    throw new Error('Not yet implemented');
    return null;
  };

  GameModel.prototype.setState = function (newState) {
    this.state = newState;
  };

  GameModel.prototype.setStateFromSnapshot = function (snap) {
    this.state.applySnapshot(snap);
  };

  GameModel.prototype.getState = function() {
    return this.state;
  };

  GameModel.prototype.addPlayer = function(player) {
    player.setModel(this);
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

  GameModel.prototype.addBullet = function(bullet) {
    this.state.addBullet(bullet);
  };

  GameModel.prototype.getBullets = function() {
    return this.state.bullets;
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
            this.state.players[j].hit();

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
  }

  GameState.prototype.applySnapshot = function(snap) {
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
      bullets: {}
    };

    for (var i in this.players) {
      snap.players[i] = this.players[i].dumpAttributes();
    }

    for (var i in this.bullets) {
      snap.bullets[i] = this.bullets[i].dumpAttributes();
    }

    return snap;
  };

  GameState.prototype.makeDiff = function() {
    throw new Error('Not implemented');
  };

  GameState.prototype.applyDiff = function() {

  };


  GameState.prototype.addPlayer = function(player) {
    this.players[player.attrs.id] = player;
  };

  GameState.prototype.removePlayer = function(player) {
    delete this.players[player.attrs.id];
  };

  GameState.prototype.removePlayerId = function(id) {
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

  return GameModel;
}));
