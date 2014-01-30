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
}(['./GameObject'], function(GameObject){

  var ObjectsFactory = {
    create: function(props) {

      var ctrs = [];
      var attrs = [];

      var obj = function() {
        this.attrs = {};
        for (var i in attrs) {
          this.attrs[i] = attrs[i];
        }

        for (var i = 0 ; i < ctrs.length ; i++) {
          ctrs[i].apply(this, arguments);
        }
      }

      var mixins = [GameObject].concat(Array.prototype.slice.call(arguments, 1), props);
      for (var i = 0 ; i < mixins.length ; i++) {
        for (var j in mixins[i]) {
          if (j === 'init') {
            ctrs.push(mixins[i][j]);
          } else if (j === 'attrs') {
            for (var k in mixins[i][j]) {
              attrs[k] = mixins[i][j][k];
            }
          } else {
            obj.prototype[j] = mixins[i][j];
          }
        }
      }

      return obj;
    }
  }

  return ObjectsFactory;
}));
