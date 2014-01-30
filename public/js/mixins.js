(function (deps, factory) {
  if (typeof module === 'object') {
    var modules = [];
    for (var i in deps) {
      modules.push(require(deps[i]));
    }
    module.exports = factory.apply(this, modules);
  } else {
    define(deps, factory);
  }
}([], function () {

  var mixins = {
    Mobile: {
      attrs: {
        vx: 0,
        vy: 0
      },
      move: function (dt) {
        this.attrs.x += this.attrs.vx * dt;
        this.attrs.y += this.attrs.vy * dt;
      }
    },

    TwoD: {
      attrs: {
        x: 0,
        y: 0
      },
      distanceTo: function (other) {
        var dx = this.attrs.x - other.attrs.x;
        var dy = this.attrs.y - other.attrs.y;
        return Math.sqrt(dx * dx + dy * dy);
      }
    },

    Orientable: {
      attrs: {
        angle: 0,
        angleV: 0
      },
      rotate: function (dt) {
        this.attrs.angle += this.attrs.angleV * dt;
      }
    },

    // Things that have an action on the model
    Actor: {
      model: null,
      setModel: function (model) {
        this.model = model
      }
    },
  }
  return mixins;
}));
