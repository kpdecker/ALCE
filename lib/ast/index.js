var ArrayCollection = require('./array'),
    Collection = require('./collection'),
    Expression = require('./expression'),
    ObjectCollection = require('./object'),
    Property = require('./property'),
    Value = require('./value');

module.exports = {
  Array: ArrayCollection,
  Collection: Collection,
  Expression: Expression,
  Object: ObjectCollection,
  Property: Property,
  Value: Value,

  fromValue: function(value, existingNode) {
    if (value instanceof ArrayCollection || value instanceof ObjectCollection || value instanceof Value) {
      return value;
    }

    var node;
    if (Array.isArray(value)) {
      node = ArrayCollection.fromArray(value, existingNode);
    } else if (typeof value === 'object') {
      node = ObjectCollection.fromObject(value, existingNode);
    } else {
      node = Value.fromValue(value, existingNode);
    }
    if (existingNode) {
      node.preamble = existingNode.preamble;
      node.prologue = existingNode.prologue;
    }
    return node;
  }
};
