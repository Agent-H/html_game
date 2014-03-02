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
}(['./Tick', './eventsManager'], function(Tick, events){
  function Game() {
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
    events.send('gamePause');
    this.tick.stop();
  }

  Game.prototype.start = function() {
    events.send('gameStart');
    this.tick.start();
  }

  return new Game();
}));
