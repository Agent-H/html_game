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
}(['../EventEmitter', '../utils'], function (Events, utils) {

  var AbstractEffect = {};

  AbstractEffect.destroy = function() {
    this.trigger('destroy');
  };

  utils.extend(AbstractEffect, Events);

  return AbstractEffect;

}));
