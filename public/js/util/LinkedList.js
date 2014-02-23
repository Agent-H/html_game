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

    /* Incomplete linked list implementation.
       Provides only the functionalities required in the rest of the project
       and guarantees maximum performance for these.
    */

    function Node(value, previous) {
      this.value = value;
      this.next = null;
      this.previous = null;
    }

    /*
      invariant: this._root === null <=> this._tail === null
    */

    function LinkedList() {
      this._root = null;
      this._tail = null;
    }

    LinkedList.prototype.pushBack = function(elem) {
      if (this._root == null) {
        this._root = this._tail = new Node(elem, null);
      } else {
        this._tail.next = new Node(elem, this._tail);
        this._tail = this._tail.next;
      }
    };

    LinkedList.prototype.popFront = function() {
      var ret = null;
      if (this._root != null) {
        ret = this._root.value;
        this._root = this._root.next;

        if (this._root === null) {
          this._tail = null;
        } else {
          this._root.previous = null;
        }
        return ret;
      }
      return null;
    };

    LinkedList.prototype.popBack = function() {
      var ret = null;
      if (this._tail != null) {
        ret = this._tail.value;
        this._tail = this._tail.previous;

        if (this._tail === null) {
          this._root = null;
        } else {
          this._tail.next = null;
        }
        return ret;
      }
      return null;
    };

    LinkedList.prototype.back = function() {
      return this._tail.value;
    };
    LinkedList.prototype.front = function() {
      return this._root.value;
    };

    LinkedList.prototype.isEmpty = function() {
      return this._root === null;
    };

    return LinkedList;
  })
);
