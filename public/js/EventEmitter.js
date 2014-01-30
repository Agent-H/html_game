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
}([], function() {

  var EventEmitter = {

    on: function(evt, cb) {
      if (this._listeners === undefined) {
        this._listeners = {};
      }

      if (this._listeners[evt] === undefined) {
        this._listeners[evt] = [];
      }

      this._listeners[evt].push(cb);
    },

    trigger: function(evt, data) {
      if (this._listeners === undefined || this._listeners[evt] === undefined) {
        return;
      }

      for (var i in this._listeners[evt]) {
        this._listeners[evt][i](data);
      }
    }
  }

  return EventEmitter;

}));
