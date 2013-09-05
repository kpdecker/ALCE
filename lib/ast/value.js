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

  get: function() {
    return this.value;
  },

  toString: function() {
    return this.preamble + this.source;
  },
  toObject: function() {
    return this.value;
  }
};
