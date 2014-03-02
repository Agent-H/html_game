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
}(['Player', './config', './eventsManager'], function(Player, config, eventsManager){

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
          {keys: input._keys, lastFrame: model.getState().timestamp},
          function (data) {
            var t1 = Date.now();
            try {
              eventsManager.sendAllMaster(data.evt);
              if (data.diff !== undefined) {
                console.log('diff');
                model.updateWithDiff(data.diff);
              } else if (data.state !== undefined) {
                console.log('state');
                model.updateWithSnapshot(data.state);
              }
            } catch (e) {
              console.error(e.stack);
            }
            setTimeout(pullState, config.MIN_LATENCY - (Date.now() - t1));
          }
        );
      }

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
