require(['Game', 'Input', 'GameModel', 'GameView', 'Network'],
  function(Game, Input, GameModel, GameView, Network){

  var game = new Game(document.getElementById('canvas'));

  var input = new Input();


  game.addModule(input);
  game.addModule((game.model = new GameModel()));

  var view = new GameView(canvas, game.model);
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
