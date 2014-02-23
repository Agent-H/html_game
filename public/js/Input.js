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
}(['./Player', './utils', './EventEmitter'], function(Player, utils, EventEmitter){

  var KEY_LEFT = 37;
  var KEY_UP = 38;
  var KEY_RIGHT = 39;
  var KEY_DOWN = 40;
  var KEY_SPACE = 32;
  var KEY_J = 74;

  function Input(model) {
    this.keys = {
      left: false,
      right: false,
      up: false,
      down: false,
      space: false
    };

    this.playerId = null;
    this.model = model;
  }

  Input.prototype.setPlayerId = function(pid) {
    this.playerId = pid;
  };

  Input.prototype._getPlayer = function() {
    return this.model.getPlayer(this.playerId);
  };

  Input.prototype.listen = function() {
    var keys = this.keys;
    var self = this;

    window.addEventListener('keydown', function(evt) {
      var prevent = true;

      switch(evt.keyCode) {
        case KEY_LEFT:
          keys.left = true;
          break;
        case KEY_RIGHT:
          keys.right = true;
          break;
        case KEY_UP:
          keys.up = true;
          break;
        case KEY_DOWN:
          keys.down = true;
          break;
        case KEY_J:
          if (self.playerId == null || self._getPlayer().isDead())
            self.trigger('join');
        case KEY_SPACE:
            keys.space = true;
          break;
        default:
          prevent = false;
          break;
      }
      if (prevent) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    });

    window.addEventListener('keyup', function(evt) {
      switch(evt.keyCode) {
        case KEY_LEFT:
          keys.left = false;
          break;
        case KEY_RIGHT:
          keys.right = false;
          break;
        case KEY_UP:
          keys.up = false;
          break;
        case KEY_DOWN:
          keys.down = false;
          break;
        case KEY_SPACE:
          keys.space = false;
          break;
      }
      evt.preventDefault();
      evt.stopPropagation();
    });
  };

  Input.prototype.step = function() {

    var player = this._getPlayer();
    if (this.playerId === null || player == null || player.isDead()) return;

    player.resetControls();

    if (this.keys.left)
      player.turnLeft();
    else if (this.keys.right)
      player.turnRight();
    if (this.keys.up)
      player.moveForward();
    else if (this.keys.down)
      player.moveBackward();

    if (this.keys.space && this.canFire) {
      player.fire();
      this.canFire = false;
    }
    else if (!this.keys.space)
      this.canFire = true;
  };

  utils.extend(Input.prototype, EventEmitter);


  return Input;
}));
