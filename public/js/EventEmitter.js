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

    // Shamelessly copied from https://github.com/jeromeetienne/microevent.js

    on: function(event, fct){
      this._events = this._events || {};
      this._events[event] = this._events[event] || [];
      this._events[event].push(fct);
    },

    off: function(event, fct){
      this._events = this._events || {};
      if( event in this._events === false  )  return;
      this._events[event].splice(this._events[event].indexOf(fct), 1);
    },

    trigger: function(event /* , args... */){
      this._events = this._events || {};
      if( event in this._events === false  )  return;
      for(var i = 0; i < this._events[event].length; i++){
        try {
          this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        } catch(e) {
          console.error(e);
        }
      }
    }
  }

  return EventEmitter;

}));
