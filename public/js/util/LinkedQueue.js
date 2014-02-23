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
}([],
  function(){

    function Node(value) {
      this.value = value;
      this.next = null;
    }

    Node.prototype.method_name = function(first_argument) {
      // body...
    };

    function LinkedQueue() {
      this._root = null;
      this._tail = null;
    }

    LinkedQueue.prototype.push = function(elem) {
      if (this._root == null) {
        this._root = this._tail = new Node(elem);
      } else {
        this._tail.next = new Node(elem);
        this._tail = this._tail.next;
      }
    };

    LinkedQueue.prototype.pop = function() {
      var ret = null;
      if (this._root != null) {
        ret = this._root;
        this._root = this._root.next;
        return ret.value;
      }
      return null;
    };

    return LinkedQueue;
  })
);
