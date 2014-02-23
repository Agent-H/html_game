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
}(['Player'], function(Player){

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

            try {
              if (data.diff !== undefined) {
                console.log('update');
                model.update(data.diff);
              } else if (data.state !== undefined) {
                console.log('reset');
                model.setStateFromSnapshot(data.state);
              }
            } catch (e) {
              console.error(e.stack);
            }
            pullState();
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
