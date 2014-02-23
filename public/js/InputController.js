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
}(['./Player', './utils', './Game'], function(Player, utils, game){

  function InputController(model) {
    this._keys = {
      left: false,
      right: false,
      up: false,
      down: false,
      space: false
    };

    this.playerId = null;
  }

  InputController.prototype.setPlayerId = function(pid) {
    this.playerId = pid;
  };

  InputController.prototype._getPlayer = function() {
    return game.model.getPlayer(this.playerId);
  };

  InputController.prototype.setKey = function(key, state) {
    this._keys[key] = state;
  };

  InputController.prototype.step = function() {

    var player = this._getPlayer();
    if (this.playerId === null || player == null || player.isDead()) return;

    player.resetControls();

    if (this._keys.left)
      player.turnLeft();
    else if (this._keys.right)
      player.turnRight();
    if (this._keys.up)
      player.moveForward();
    else if (this._keys.down)
      player.moveBackward();

    if (this._keys.space && this.canFire) {
      player.fire();
      this.canFire = false;
    }
    else if (!this._keys.space)
      this.canFire = true;
  };


  return InputController;
}));
