require(['Game', 'KeyboardInput', 'GameModel', 'GameView', 'Network', './eventsManager'],
  function(game, Keyboard, GameModel, GameView, Network, eventsManager){

  var model = game.model = new GameModel();
  var input = new Keyboard();
  var view = new GameView(canvas, game.model);

  game.addModule(input);
  game.addModule(model);
  game.addModule(view);

  // The client is not master in the simulation
  game.model.setSlaveMode();
  eventsManager.setSlaveMode();

  Network.init({
    model: game.model,
    input: input,
    view: view
  });

  input.listen();

  game.start();
});
