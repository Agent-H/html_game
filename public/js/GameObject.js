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

    makeAttrsDiff: function(otherAttrs) {
      // other and this are assumed to have the same attribute names
      // TODO OPTI: diff consumes volatile memory
      var diff = {};
      for (var i in this.attrs) {
        if (this.attrs[i] != otherAttrs[i]) {
          diff[i] = this.attrs[i];
        }
      }

      return diff;
    },

    setAttributes: function(attrs) {
      for (var i in attrs) {
        this.attrs[i] = attrs[i];
      }

      return this;
    },

    interpolateAttributes: function(attrs, p) {
      if (typeof p !== 'number') throw new Error("Progress is not a number");
      for (var i in attrs) {
        if (typeof attrs[i] === 'number' && !utils.isInt(attrs[i])) {
          this.attrs[i] = (attrs[i] - this.attrs[i])*p + this.attrs[i];
        } else {
          this.attrs[i] = attrs[i];
        }
      }

      return this;
    }
  };

  return GameObject;
}));
