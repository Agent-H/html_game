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
}(['./AbstractEffect', '../utils', '../ObjectsFactory', '../mixins'],
  function (Effect, utils, ObjectsFactory, mixins) {

  var DEFAULTS = {
    minParticles: 6,
    maxParticles: 10,
    color: '#fff',
    maxSpeed: 0.3,
    minSpeed: 0,
    life: 1000
  };

  var Explosion = ObjectsFactory.create({
    init: function(data, params) {

      utils.defaults(params, DEFAULTS);
      if (params.particles) {
        params.minParticles = params.particles;
        params.maxParticles = params.particles;
      }
      this.attrs.angleV = 0;
      this.attrs.counter = 0;
      this.attrs.life = params.life;
      this.attrs.particles = [];

      this.attrs.pColor = params.color;

      var deltaParticles = params.maxParticles - params.minParticles;

      for (var i = 0 ; i < Math.random() * deltaParticles + params.minParticles ; i++) {
        var rS = Math.random() * 2 - 1;
        var speed = rS * (params.maxSpeed - params.minSpeed) + params.minSpeed * (rS > 0 ? 1 : -1);
        var angle = Math.random() * Math.PI;

        this.attrs.particles.push({
          vx: speed * Math.cos(angle),
          vy: speed * Math.sin(angle)
        });
      }
    },

    draw: function(ctx, dt) {
      if ((this.attrs.counter += dt) > this.attrs.life) {
        this.destroy();
        return;
      }
      this.move(dt);

      ctx.save();

      ctx.fillStyle = this.attrs.pColor;
      ctx.globalAlpha = 1 - (this.attrs.counter / this.attrs.life);

      var particles = this.attrs.particles;
      for (var i in particles) {
        ctx.fillRect(particles[i].vx * this.attrs.counter + this.attrs.x,
          particles[i].vy * this.attrs.counter + this.attrs.y, 2, 2);
      }

      ctx.restore();
    }
  }, Effect, mixins.TwoD, mixins.Orientable, mixins.DirectionalMobile);

  return Explosion;

}));
