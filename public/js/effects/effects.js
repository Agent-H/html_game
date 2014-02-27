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
      particles: 8,
      color: '#f35',
      maxSpeed: 0.07,
      minSpeed: 0.03,
      life: 400
    }
  }, {
    on: 'playerDead',
    ctr: Explosion,
    params: {
      particles: 100,
      color: '#c92',
      maxSpeed: 0.7,
      life: 1500
    }
  }, {
    on: 'spawn',
    ctr: Aura
  }]);

}));
