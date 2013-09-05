'use strict';

var alce = require('../lib/alce'),
    fs = require('fs');

require('should');

describe('alce', function () {
  describe('parser', function() {
    function parser(name, value) {
      it(name, function() {
        alce(value).toString().should.equal(value);
      });
    }
    parser('should parse simple objects', '{ foo: "bar"}');
    parser('should parse arrays', '["bar", 1, true]');
    parser('should parse comments around', '/*comment1*/ { foo: "bar"} // comment 2\n');

    it('should parse complicated objects', function () {
      var src = fs.readFileSync(__dirname + '/artifacts/lumbar.json');
      alce(src).toString().should.equal(src.toString());
    });
  });

  describe('#toObject', function() {
    it('should remove metadata with toObject', function() {
      var src = fs.readFileSync(__dirname + '/artifacts/lumbar.json');
      alce(src).toObject().should.eql({
        modules: {
          foo: {},
          bar: {}
        },

        arrays: [ 'foo', 9, {bar: true}, [{nested: true}]],

        expression: ({foo : true}),
        "other stuff": true,
      });
    });
  });
});
