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
}(['../effectsManager', './Explosion'], function (effectsManager, Explosion) {

  effectsManager.addEffects([{
    on: 'playerHit',
    ctr: Explosion,
    params: {
      particles: 4,
      color: '#0ff',
      maxSpeed: 0.07,
      minSpeed: 0.03,
      life: 200
    }
  }, {
    on: 'playerDead',
    ctr: Explosion,
    params: {
      particles: 20,
      color: '#c92',
      maxSpeed: 0.3,
      life: 1000
    }
  }]);

}));
