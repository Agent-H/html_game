var game = require('./public/js/Game');
var Model = require('./public/js/GameModel');
var Player = require('./public/js/Player');
var Input = require('./public/js/InputController');
var config = require('./public/js/config')
var events = require('./public/js/eventsManager');
var NPCs = require('./public/js/NPCModule');

var DeathmatchScenario = require('./public/js/scenarios/DeathmatchScenario');

exports.listen = function(io) {

  var inputs = {
    clients: {},
    step: function(dt) {
      for (var i in inputs.clients) {
        inputs.clients[i].step(dt);
      }
    }
  };



  // We create the game here
  var model = game.model = new Model();
  var npcs = new NPCs(2);
  var scenario = new DeathmatchScenario(game, npcs);

  game.addModule(inputs);
  game.addModule(npcs);
  game.addModule(model);
  game.addModule(scenario);

  npcs.spawn(); // Creates npcs
  scenario.start(); // Starts game

  io.sockets.on('connection', function (socket) {
    socket.broadcast.emit('log', 'user connected');
    var player = new Player({
      name: 'Human'
    });

    var eventsBuffer = [];
    events.on('any', onEvent);
    events.send('join', player.attrs);

    var input = new Input();
    input.setPlayerId(player.attrs.id);
    inputs.clients[player.attrs.id] = input;

    socket.on('disconnect', function() {
      events.send('leave', player.attrs);
      model.removePlayer(player);
      events.off('any', onEvent);
      delete inputs.clients[player.attrs.id];
    });

    socket.on('join', function(data, ack) {
      player.spawn();
      model.addPlayer(player);
      ack(player.attrs);
    });

    // buffers game events to send to client
    function onEvent(type, data) {
      eventsBuffer.push({type: type, data: data});
    }

    function transmitState(data, ack) {
      if (false /*typeof data.lastFrame !== 'undefined'*/) {
        var snap = model.getSnapshot(data.lastFrame);
        if (snap != null) {
          ack({diff: model.getState().makeDiff(snap), evt: eventsBuffer});
          eventsBuffer.length = 0;
          return;
        }
      }

      // In case we could not perform diff update
      ack({state: model.getState().takeSnapshot(), evt: eventsBuffer}); // Full update
      eventsBuffer.length = 0;
    }

    var lastFetch = 0;
    socket.on('fetch', function(data, ack) {

      // TODO: unsafe access to private member
      input._keys = data.keys;

      var time = Date.now();

      // This is only used to avoid flooding, clients should implement this timer themselves.
      if (time - lastFetch < config.MIN_LATENCY) {
        setTimeout(function(){
          lastFetch = Date.now();
          transmitState(data, ack);
        }, config.MIN_LATENCY - (time - lastFetch));

      } else {
        lastFetch = time;
        // lagg simulation:
        // setTimeout(function(){
          transmitState(data, ack);
        // },
        //   120); // Constant lagg
        //   Math.random() * 120); // Random lagg
        //   100 + Math.random(20));
      }
    });
  });
};
