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
}(['./EventEmitter', './utils'],
  function(EventEmitter, utils){

    /*
      Events designates any special thing that happenned at an exact time.
      They can trigger animations or messages.

      For now, only the master can send events to slaves.
    */

    function EventsManager() {
      this._isMaster = true;
    }
    utils.extend(EventsManager.prototype, EventEmitter);

    EventsManager.prototype.setSlaveMode = function() {
      this._isMaster = false;
    };

    EventsManager.prototype._send = function(type, data) {
      this.trigger(type, data);
      this.trigger('any', type, data);
    };

    EventsManager.prototype.send = function(type, data) {
      if (this._isMaster) {
        this._send(type, data);
      }
    };

    EventsManager.prototype.sendAll = function(evts) {
      for (var i = 0 ; i < evts.length ; i++) {
        this.send(evts[i].type, evts[i].data);
      }
    };

    EventsManager.prototype.sendAllMaster = function(evts) {
      for (var i = 0 ; i < evts.length ; i++) {
        this.sendMaster(evts[i].type, evts[i].data);
      }
    };

    EventsManager.prototype.sendMaster = EventsManager.prototype._send;



    return new EventsManager();
  })
);
