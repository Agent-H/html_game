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
}(['../eventsManager', '../utils'],
  function(events, utils){

    function CommonScenario(game) {
      this.game = game;

      utils.bindAll(this, 'onKill');
    }

    CommonScenario.prototype.start = function() {
      events.on('kill', this.onKill);

      this.game.start();
    };

    CommonScenario.prototype.stop = function() {
      this.game.stop();

      events.off('kill', this.onKill);
    };

    CommonScenario.prototype.step = function(dt) {
      // does nothing
    };

    CommonScenario.prototype.onKill = function(evt) {
      var p1 = this.game.model.getPlayer(evt.killer);
      var n2 = this.game.model.getPlayer(evt.killee);

      p1.attrs.score ++;
    };

    return CommonScenario;
  })
);
