var Collection = require('./collection'),
    util = require('util');

module.exports = ArrayCollection;

function ArrayCollection(node, src, options) {
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

ArrayCollection.prototype.set = function(id, value) {
  // Require here to break circular dependency
  var ast = require('./index');
  var original = this.children[id],
      node = ast.fromValue(value, original, this, this.options);

  if (!original) {
    if (this.options && this.options.insertFormatter) {
      this.options.insertFormatter(this, node);
    } else if (this.children.length) {
      node.preamble = ',';
    }
  }

  this.children[id] = node;
};

ArrayCollection.fromArray = function(value, parent, options) {
  var node = new ArrayCollection(undefined, undefined, options);

  if (options && options.objectFormatter) {
    options.objectFormatter(parent, node);
  }

  value.forEach(function(value, index) {
    node.set(index, value);
  });
  return node;
};
