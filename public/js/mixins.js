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
}(['./Game'], function (game) {

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

    // Mobile which movement depends on the orientation (like a car)
    // Depends on 2D and Orientable
    DirectionalMobile: {
      attrs: {
        vx: 0,
        vy: 0
      },
      move: function (dt) {
        this.attrs.x += (this.attrs.vx * Math.cos(this.attrs.angle) + this.attrs.vy * Math.sin(this.attrs.angle)) * dt;
        this.attrs.y += (this.attrs.vx * Math.sin(this.attrs.angle) + this.attrs.vy * Math.cos(this.attrs.angle)) * dt;
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

    Ownable: {
      attrs: {
        owner: -1
      },
      getOwner: function() {
        return game.model.getPlayer(this.attrs.owner);
      }
    }
  }
  return mixins;
}));
