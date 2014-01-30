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
}([], function(){

  function Tick(cb, ctx) {
    this._cb = cb;
    this._ctx = ctx;
    this._stopped = false;

    this._interval = 30;

    this._useAnimFrame = (typeof window !== 'undefined');

    var self = this;

    var lastTime = 0;
    this.setLastTime = function(time) {
      lastTime = time;
    };

    var _run = this._run = function() {
      if (self._stopped) return;
      var time = Date.now();

      try {
        cb.call(ctx, time - lastTime);
      } catch (e) {
        console.error(e.stack);
      }
      lastTime = time;
      if (self._useAnimFrame)
        requestAnimationFrame(_run);
      else
        setTimeout(_run, self._interval);
    }
  }

  Tick.prototype.start = function() {
    this.setLastTime(Date.now());
    this._stopped = false;
    this._run();
  };

  Tick.prototype.stop = function() {
    this._stopped = true;
  };

  Tick.prototype.setInterval = function(time) {
    this._useAnimFrame = false;
    this._interval = time;
  };

  return Tick;
}));
