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
}(['./util/LinkedList'],
  function(LinkedList){

    /*
      Stores Game snapshots in chronological order.
      Fast access to a snapshot with it's timestamp.
      Fast insertion of new snapshots.
      Automatically removes older snapshots.
      No out of order deletions.
    */
    function History(capacity) {

      this._timestamps = new LinkedList();
      this._size = 0;
      this._capacity = capacity;

      // Internal collection
      this._coll = {};
    };

    History.prototype.add = function(snapshot) {
      var timestamp = snapshot.timestamp;

      this._coll[timestamp] = snapshot;

      this._timestamps.pushBack(timestamp);
      if (++this._size >= this._capacity) {
        this._size--;
        var ts = this._timestamps.popFront();
        delete this._coll[ts];
      }
    };

    History.prototype.get = function(timestamp) {
      return this._coll[timestamp];
    };

    History.prototype.getLast = function() {
      return this._coll[this._timestamps.back()]
    };

    return History;
  })
);
