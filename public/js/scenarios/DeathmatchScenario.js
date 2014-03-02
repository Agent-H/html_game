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
}(['./CommonScenario', '../utils', '../eventsManager'],
  function(CommonScenario, utils, events){

    var ROUND_DURATION = 60 * 4 * 1000; // 4 min rounds

    function DeathmatchScenario() {
      CommonScenario.apply(this, arguments);
    }
    utils.extend(DeathmatchScenario.prototype, CommonScenario.prototype);

    DeathmatchScenario.prototype.start = function() {
      CommonScenario.prototype.start.apply(this);

      this.timer = ROUND_DURATION;
    };

    DeathmatchScenario.prototype.step = function(dt) {
      CommonScenario.prototype.step.apply(this);
      if ((this.timer -= dt) <= 0) {
        /*this.game.pause();
        events.send("endOfGame");*/
      }
    };


    return DeathmatchScenario;
  })
);
