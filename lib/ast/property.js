var util = require('../util'),
      extractRange = util.extractRange;

module.exports = Property;

function Property(node, src) {
  this.range = node.range;
  this.source = extractRange(src, node.range);
}
Property.prototype = {
  preamble: '',
  key: undefined,
  separator: ':',
  value: undefined,
  prologue: '',

  toString: function() {
    return this.preamble + this.key + this.separator + this.value + this.prologue;
  },

  _leave: function(src) {
    this.separator = extractRange(src, [this.key.range[1], this.value.range[0]]);
    this.prologue = extractRange(src, [this.value.range[1], this.range[1]]);
  },
  _insert: function(value) {
    if (!this.key) {
      this.key = value;
    } else {
      this.value = value;
    }
  }
};
