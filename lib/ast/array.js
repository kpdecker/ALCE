var Collection = require('./collection'),
    util = require('util');

module.exports = ArrayCollection;

function ArrayCollection(node, src) {
  Collection.apply(this, arguments);

  this.isArray = true;

  Object.defineProperty(this, 'length', {
    enumerable: true,
    get: function() {
      return this.children.length;
    }
  });
}

util.inherits(ArrayCollection, Collection);

ArrayCollection.prototype.open = '[';
ArrayCollection.prototype.close = ']';

ArrayCollection.prototype.toObject = function() {
  return this.children.map(function(child) { return child.toObject(); });
};

ArrayCollection.prototype._getChild = function(id) {
  return this.children[id];
};
