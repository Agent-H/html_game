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
}(['../effectsManager', './Explosion', './Aura'],
  function (effectsManager, Explosion, Aura) {

  effectsManager.addEffects([{
    on: 'playerHit',
    ctr: Explosion,
    params: {
      particles: 10,
      color: '#f35',
      maxSpeed: 0.07,
      minSpeed: 0.03,
      life: 400
    }
  }, {
    on: 'playerDead',
    ctr: Explosion,
    params: {
      particles: 80,
      color: '#c92',
      maxSpeed: 0.13,
      life: 1000
    }
  }, {
    on: 'spawn',
    ctr: Aura
  }]);

}));
