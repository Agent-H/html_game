require(['Game', 'KeyboardInput', 'GameModel', 'GameView', 'Network'],
  function(game, Keyboard, GameModel, GameView, Network){

  var model = game.model = new GameModel();
  var input = new Keyboard();
  var view = new GameView(canvas, game.model);

  game.addModule(input);
  game.addModule(model);
  game.addModule(view);

  // We activate the lazy simulation for the client
  game.model.setSlaveMode();

  Network.init({
    model: game.model,
    input: input,
    view: view
  });

  input.listen();

  game.start();
});
