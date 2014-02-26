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
}([], function(){

  var config = {
    PLAYER_INITIAL_LIVES: 3,
    PLAYER_ANGLE_INCREMENT: Math.PI/1200,
    PLAYER_FWD_SPEED: 0.1,
    PLAYER_BWD_SPEED: 0.07,
    PLAYER_BARREL_POS: 7,
    PLAYER_FIRE_DELAY: 250,
    PLAYER_HIT_RADIUS: 8,

    BULLET_SPEED: 0.2,

    WORLD_WIDTH: 900,
    WORLD_HEIGHT: 500,
    // keeps the 20 last frames in memory
    HISTORY_DEPTH: 20,

    // Network
    MIN_LATENCY: 60
  };

  return config;
}));
