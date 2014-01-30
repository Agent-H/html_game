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
}(['./Tick'], function(Tick){
  function Game(canvas) {
    this.modules = [];

    this.tick = new Tick(this.loop, this);
  }

  Game.prototype.loop = function(dt) {
    for (var i = 0 ; i < this.modules.length ; i++) {
      this.modules[i].step(dt);
    }
  };

  Game.prototype.addModule = function(mod) {
    this.modules.push(mod);
  };

  Game.prototype.pause = function() {
    this.tick.stop();
  }

  Game.prototype.start = function() {
    this.tick.start();
  }

  return Game;
}));
