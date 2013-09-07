var AST = require('./ast'),
    esprima = require('esprima'),
    traverse = require('estraverse').traverse,
    util = require('./util'),
      extractRange = util.extractRange;


exports.parse = function(src, options) {
  options = options || {};

  src = src.toString();

  var ast = esprima.parse('(' + src + ')', {range: true, loc: true}),
      ret,
      stack = [];

  traverse(ast, {
    enter: function(node) {
      if (node.type === 'ExpressionStatement') {
        stack.unshift(new AST.Expression(node, src, options));
      } else if (node.type === 'ArrayExpression') {
        stack.unshift(new AST.Array(node, src, options));
      } else if (node.type === 'ObjectExpression') {
        stack.unshift(new AST.Object(node, src, options));
      } else if (node.type === 'Property') {
        stack.unshift(new AST.Property(node, src, options));
      } else if (node.type === 'Identifier' || node.type === 'Literal') {
        stack.unshift(new AST.Value(node, src, options));
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

  return (options && options.meta) ? ret : ret.toObject();
};

exports.stringify = function(object) {
  return object.toString();
};

exports.calcIndent = util.calcIndent;
