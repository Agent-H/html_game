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
}(['./InputController', './utils', './EventEmitter'],
  function(InputController, utils, EventEmitter){

  var KEY_LEFT = 37;
  var KEY_UP = 38;
  var KEY_RIGHT = 39;
  var KEY_DOWN = 40;
  var KEY_SPACE = 32;
  var KEY_J = 74;

  /*
    Handles keyboard inputs. Redirects them to InputController for player control
    or triggers events for game navigation.
  */
  function KeyboardInput() {
    InputController.apply(this, arguments);
  }

  KeyboardInput.prototype.listen = function() {
    var self = this;

    window.addEventListener('keydown', function(evt) {
      var prevent = true;

      switch(evt.keyCode) {
        case KEY_LEFT:
          self.setKey('left', true);
          break;
        case KEY_RIGHT:
          self.setKey('right', true);
          break;
        case KEY_UP:
          self.setKey('up', true);
          break;
        case KEY_DOWN:
          self.setKey('down', true);
          break;
        case KEY_J:
          if (self.playerId == null || self._getPlayer().isDead())
            self.trigger('join');
        case KEY_SPACE:
            self.setKey('space', true);
          break;
        default:
          prevent = false;
          break;
      }
      if (prevent) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    });

    window.addEventListener('keyup', function(evt) {
      switch(evt.keyCode) {
        case KEY_LEFT:
          self.setKey('left', false);
          break;
        case KEY_RIGHT:
          self.setKey('right', false);
          break;
        case KEY_UP:
          self.setKey('up', false);
          break;
        case KEY_DOWN:
          self.setKey('down', false);
          break;
        case KEY_SPACE:
          self.setKey('space', false);
          break;
      }
      evt.preventDefault();
      evt.stopPropagation();
    });
  };

  utils.extend(KeyboardInput.prototype, EventEmitter);
  utils.extend(KeyboardInput.prototype, InputController.prototype);


  return KeyboardInput;
}));
