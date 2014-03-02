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
}(['./AbstractEffect', '../utils', '../ObjectsFactory', '../mixins', '../Game'],
  function (Effect, utils, ObjectsFactory, mixins, game) {

  var DEFAULTS = {};

  var Aura = ObjectsFactory.create({

    init: function(data, params) {
      this.attrs.counter = 0;
      this.attrs.life = 2000;

      this.attrs.target = data.id;
    },

    draw: function(ctx, dt) {
      var target = game.model.getPlayer(this.attrs.target);
      if (target == null) {
        return this.destroy();
      }
      if ((this.attrs.counter += dt) > this.attrs.life) {
        this.destroy();
        return;
      }

      var r = Math.sin(this.attrs.counter/500*Math.PI) * 5 + 10;

      ctx.save();

      ctx.strokeStyle = '#acf';
      ctx.translate(target.attrs.x, target.attrs.y);

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI*2);
      ctx.stroke();

      ctx.restore();

    }
  }, Effect);

  return Aura;
}));
