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
}(['./eventsManager'],
  function(events){

    function EffectsManager() {
      this._effects = [];
    }

    EffectsManager.prototype.addEffect = function(event, Ctr, params) {
      var effs = this._effects;
      events.on(event, function(data) {
        var effect = new Ctr(data, params);
        effs.push(effect);
        effect.on('destroy', onDestroy);

        function onDestroy() {
          effs.splice(effs.indexOf(effect), 1);
          effect.off('destroy', onDestroy);
        };
      });
    };

    EffectsManager.prototype.getEffects = function() {
      return this._effects;
    };

    return new EffectsManager();
  })
);
