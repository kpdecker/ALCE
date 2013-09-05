var util = require('../util'),
      extractRange = util.extractRange;

module.exports = Collection;

function Collection(node, src) {
  var isArray = node.type === 'ArrayExpression';

  this.isArray = isArray;
  this.range = node.range;
  this.innerRange = [node.range[0] + 1, node.range[1] - 1];
  this.source = extractRange(src, node.range);
  this.open = isArray ? '[' : '{';
  this.values = {};
  this.children = [];
  this.close = isArray ? ']' : '}';
}
Collection.prototype = {
  preamble: '',
  innerPrologue: '',
  prologue: '',

  toString: function() {
    return this.preamble + this.open + this.children.join('') + this.innerPrologue + this.close + this.prologue;
  },
  toObject: function() {
    if (this.isArray) {
      return this.children.map(function(child) { return child.toObject(); });
    } else {
      var ret = {};
      this.children.forEach(function(child) {
        ret[child.key.toObject()] = child.value.toObject();
      });
      return ret;
    }
  },

  _leave: function(src) {
    var last = this.children[this.children.length - 1];

    if (last) {
      this.innerPrologue = extractRange(src, [last.range[1], this.innerRange[1]]);
    } else {
      this.innerPrologue = extractRange(src, this.innerRange);
    }
  },

  _insert: function(value, src) {
    if (value.key) {
      this.values[value.key.value] = value;
    }

    var priorSibling = this.children[this.children.length - 1];

    this.children.push(value);

    var priorRange;
    if (priorSibling) {
      priorRange = [priorSibling.range[1], value.range[0]];
    } else {
      priorRange = [this.innerRange[0], value.range[0]];
    }

    value.preamble = extractRange(src, priorRange);
  }
};
