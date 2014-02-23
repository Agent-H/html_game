require(['Game', 'Input', 'GameModel', 'GameView', 'Network'],
  function(game, Input, GameModel, GameView, Network){

  var model = game.model = new GameModel();
  var input = new Input(model);
  var view = new GameView(canvas, game.model);

  game.addModule(input);
  game.addModule(model);
  game.addModule(view);

  // We activate the lazy simulation for the client
  game.model.step = game.model.project;

  Network.init({
    model: game.model,
    input: input,
    view: view
  });

  input.listen();

  game.start();
});
