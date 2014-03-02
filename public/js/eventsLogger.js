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
}(['./eventsManager', './Game'], function(events, game) {

  events.on('kill', function(attrs) {
    var n1 = game.model.getPlayer(attrs.killer).attrs.name;
    var n2 = game.model.getPlayer(attrs.killee).attrs.name;

    console.log(n1 + ' killed ' + n2);
  });

  events.on('log', function(attrs) {
    console.log(attrs);
  });

  events.on('join', function(attrs) {
    console.log(attrs.name + ' (' + attrs.id + ') joined the game');
  });

  events.on('leave', function(attrs) {
    console.log(attrs.name + ' (' + attrs.id + ') left the game');
  });

  events.on('spawn', function(attrs) {
    console.log(attrs.name + ' (' + attrs.id + ') spawned');
  });

  events.on('endOfGame', function(attrs) {
    console.log("stop !!!");
  });


  // TEST CODE
  events.on('gamePause', function(attrs) {
    game.pause();
  });

  events.on('gameStart', function() {
    game.start();
  });

}));
