var util = require('../util'),
      extractRange = util.extractRange;

module.exports = Value;

function Value(node, src) {
  if (!node) {
    return;
  }

  this.range = node.range;
  this.source = extractRange(src, node.range);

  this.value = node.name || node.value;
}
Value.prototype = {
  preamble: '',
  prologue: '',

  get: function() {
    return this.value;
  },
  set: function(value) {
    this.value = value;
    this.source = JSON.stringify(value);
  },

  toString: function() {
    return this.preamble + this.source + this.prologue;
  },
  toObject: function() {
    return this.value;
  }
};

Value.fromValue = function(value) {
  var node = new Value();
  node.set(value);
  return node;
};
