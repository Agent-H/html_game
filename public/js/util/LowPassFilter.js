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

    function LowPassFilter(n) {
      this._n = n;
      this._counter = 0;
      this.value = 0;
      this._data = new Array(n);
      for (var i = 0 ; i < n ; i++) {
        this._data[i] = 0;
      }
    }

    LowPassFilter.prototype.addSample = function(s) {
      s /= this._n;
      this.value -= this._data[this._counter];
      this.value += s;
      this._data[this._counter] = s;

      if (++this._counter >= this._n) {
        this._counter = 0;
      }
    };

    return LowPassFilter;
  })
);
