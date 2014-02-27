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
}(['./Game', './eventsManager'],
  function(game, events){

    events.on('kill', function(evt) {
      var p1 = game.model.getPlayer(evt.killer);
      var n2 = game.model.getPlayer(evt.killee);

      p1.attrs.score ++;
    });

    events.on('gameStart', function(evt) {

    });

    return
  })
);
