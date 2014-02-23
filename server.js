var game = require('./public/js/Game');
var Model = require('./public/js/GameModel');
var Player = require('./public/js/Player');
var Input = require('./public/js/Input');


var MIN_LATENCY = 60;


exports.listen = function(io) {

  var inputs = {
    clients: {},
    step: function(dt) {
      for (var i in inputs.clients) {
        inputs.clients[i].step(dt);
      }
    }
  };

  var model = game.model = new Model();
  game.addModule(inputs);
  game.addModule(model);

  game.start();

  io.sockets.on('connection', function (socket) {
    socket.broadcast.emit('log', 'user connected');
    var player = new Player();

    var input = new Input(model);
    input.setPlayerId(player.attrs.id);
    inputs.clients[player.attrs.id] = input;

    socket.on('disconnect', function() {
      socket.broadcast.emit('log', 'user disconnected');
      model.removePlayer(player);
      delete inputs.clients[player.attrs.id];
    });

    socket.on('join', function(data, ack) {
      player.reset();
      model.addPlayer(player);
      ack(player.attrs);
    });

    function transmitState(data, ack) {
      if (typeof data.lastFrame !== 'undefined') {
        var snap = model.getSnapshot(data.lastFrame);
        if (snap != null) {
          ack({diff: model.getState().makeDiff(snap)});
          return;
        }
      }

      // In case we could not perform diff update
      ack({state: model.getState().takeSnapshot()}); // Full update
    }

    var lastFetch = 0;
    socket.on('fetch', function(data, ack) {
      input.keys = data.keys;

      var time = Date.now();
      if (time - lastFetch < MIN_LATENCY) {
        setTimeout(function(){
          lastFetch = Date.now();
          transmitState(data, ack);
        }, MIN_LATENCY - (time - lastFetch));
      } else {
        lastFetch = time;
        transmitState(data, ack);
      }
    });
  });
};
