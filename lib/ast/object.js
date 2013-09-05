var Collection = require('./collection'),
    util = require('util');

module.exports = ObjectCollection;

function ObjectCollection(node, src) {
  Collection.apply(this, arguments);

  this.isArray = true;

  Object.defineProperty(this, 'length', {
    enumerable: true,
    get: function() {
      return this.children.length;
    }
  });
}

util.inherits(ObjectCollection, Collection);

ObjectCollection.prototype.open = '{';
ObjectCollection.prototype.close = '}';

ObjectCollection.prototype.toObject = function() {
  var ret = {};
  this.children.forEach(function(child) {
    ret[child.key.toObject()] = child.value.toObject();
  });
  return ret;
};

ObjectCollection.prototype._getChild = function(id) {
  return this.values[id];
};
