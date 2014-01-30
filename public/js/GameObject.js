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
}(['./utils'], function(utils){

  var GameObject = {
    init: function(attrs){
      this.attrs.id = utils.guid();
      if (attrs !== undefined) {
        for (var i in attrs) {
          this.attrs[i] = attrs[i];
        }
      }
    },

    dumpAttributes: function() {
      var out = {};

      for (var i in this.attrs) {
        out[i] = this.attrs[i];
      }

      return out;
    },

    makeDiff: function(other) {
      // other and this are assumed to have the same attribute names
      // TODO OPTI: diff consumes volatile memory
      var diff = {};
      for (var i in this.attrs) {
        if (this.attrs[i] != other.attrs[i]) {
          diff[i] = other.attrs[i];
        }
      }

      return diff;
    },

    setAttributes: function(attrs) {
      for (var i in attrs) {
        this.attrs[i] = attrs[i];
      }

      return this;
    }
  };

  return GameObject;
}));
