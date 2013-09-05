var esprima = require('esprima'),
    traverse = require('estraverse').traverse,
    util = require('./util'),
      extractRange = util.extractRange;


var Collection = require('./ast/collection'),
    Expression = require('./ast/expression'),
    Property = require('./ast/property'),
    Value = require('./ast/value');


module.exports = function(src, options) {
  options = options || {};

  src = src.toString();

  var ast = esprima.parse('(' + src + ')', {range: true, loc: true}),
      ret,
      stack = [];

  traverse(ast, {
    enter: function(node) {
      if (node.type === 'ExpressionStatement') {
        stack.unshift(new Expression(node, src));
      } else if (node.type === 'ObjectExpression' || node.type === 'ArrayExpression') {
        stack.unshift(new Collection(node, src));
      } else if (node.type === 'Property') {
        stack.unshift(new Property(node, src));
      } else if (node.type === 'Identifier' || node.type === 'Literal') {
        stack.unshift(new Value(node, src));
      } else {
        node.ignore = true;
      }
    },
    leave: function(node) {
      if (node.ignore) {
        return;
      }

      var top = stack.shift(),
          parent = stack[0];

      if (top._leave) {
        ret = top._leave(src);
      }
      if (parent && parent._insert) {
        parent._insert(top, src);
      }
    }
  });

  return ret;
};
