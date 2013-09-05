var util = require('../util'),
      extractRange = util.extractRange;

module.exports = Value;

function Value(node, src) {
  this.range = node.range;
  this.source = extractRange(src, node.range);

  this.value = node.name || node.value;
}
Value.prototype = {
  preamble: '',

  toString: function() {
    return this.preamble + this.source;
  },
  toObject: function() {
    return this.value;
  }
};
