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
}(['Player', './config'], function(Player, config){

  return {
    init: function(args) {

      var model = args.model;
      var input = args.input;
      var view = args.view;

      var socket = io.connect(window.location.pathname);

      function pullState() {
        var time = Date.now();
        socket.emit(
          'fetch',
          {keys: input.keys, lastFrame: model.getState().timestamp},
          function (data) {
            var t1 = Date.now();
            try {
              if (data.diff !== undefined) {
                model.update(data.diff);
              } else if (data.state !== undefined) {
                model.setStateFromSnapshot(data.state);
              }
            } catch (e) {
              console.error(e.stack);
            }
            setTimeout(pullState, config.MIN_LATENCY - (Date.now() - t1));
          }
        );
      }

      socket.on('log', function(msg) {
        console.log(msg);
      });

      input.on('join', function(){
        socket.emit('join', {}, function(p) {
          var player = new Player(p);

          model.addPlayer(player);
          input.setPlayerId(p.id);
          view.setPlayerId(p.id);

        });
      });

      pullState();
    }
  };

}));
