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
}(['./ObjectsFactory', './config', './mixins'], function (ObjectsFactory, config, mixins) {

  var Bullet = ObjectsFactory.create({

  }, mixins.TwoD, mixins.Mobile, mixins.ownable);

  return Bullet;
}));
