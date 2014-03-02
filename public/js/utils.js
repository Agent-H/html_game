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
  var utils = {
    guid: function() {
      return Math.random().toString(16).substr(2, 6) +
        Math.random().toString(16).substr(2, 6);
    },

    extend: function(out) {
      var srcs = Array.prototype.slice.call(arguments, 1);
      for (var i in srcs) {
        for (var j in srcs[i]) {
          out[j] = srcs[i][j];
        }
      }
      return out;
    },

    defaults: function(out) {
      var srcs = Array.prototype.slice.call(arguments, 1);
      for (var i in srcs) {
        for (var j in srcs[i]) {
          if (out[j] === undefined)
            out[j] = srcs[i][j];
        }
      }
      return out;
    },

    bindAll: function(obj) {
      var names = Array.prototype.slice.call(arguments, 1);
      for (var i in names) {
        obj[names[i]] = obj[names[i]].bind(obj);
      }
    },

    // Cheap way to type number vars (int or float)
    isInt: function(nb) {
      return nb.toString().indexOf('.') === -1;
    }
  };

  return utils;
}));
