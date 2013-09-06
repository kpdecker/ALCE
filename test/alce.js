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
        "other stuff": true
      });
    });
  });

  describe('accessor', function() {
    describe('objects', function() {
      var config;
      beforeEach(function() {
        config = alce('{\n  foo:\n    // a comment\n    true\n}');
      });
      it('should return values', function() {
        config.get('foo').should.equal(true);
      });
      it('should return complex values', function() {
        config = alce('{\n  foo:\n    // a comment\n    {bar: "bat"}\n}');
        config.get('foo').get('bar').should.equal('bat');
      });
      it('should update existing values', function() {
        config.set('foo', false);
        config.toString().should.equal('{\n  foo:\n    // a comment\n    false\n}');
      });
      it('should update existing values', function() {
        config.set('foo', {foo: 'bar'});
        config.toString().should.equal('{\n  foo:\n    // a comment\n    {"foo":"bar"}\n}');
      });
      it('should insert new formatted values', function() {
        config = alce('{\n  foo:\n    // a comment\n    true\n}', {
          insertFormatter: function(parent, insert) {
            insert.preamble = (parent.children.length ? ',' : '') + '\n  ' + alce.calcIndent(parent.preamble);
          },
          propertyFormatter: function(parent, property) {
            property.separator = ': ';
          }
        });
        config.set('bar', true);
        config.toString().should.equal('{\n  foo:\n    // a comment\n    true,\n  "bar": true\n}');
      });
      it('should insert new object values', function() {
        config = alce('{\n  foo:\n    // a comment\n    true\n}', {
          objectFormatter: function(parent, object) {
            object.indent = alce.calcIndent(parent.preamble);
            object.innerPrologue = '\n' + object.indent;
          },
          insertFormatter: function(parent, insert) {
            var indent = parent.indent || alce.calcIndent(parent.preamble);
            insert.preamble = (parent.children.length ? ',' : '') + '\n  ' + indent;
          },
          propertyFormatter: function(parent, property) {
            property.separator = ': ';
          }
        });
        config.set('bar', {foo: 'bar', baz: 'bat'});
        config.toString().should.equal('{\n  foo:\n    // a comment\n    true,\n  "bar": {\n    "foo": "bar",\n    "baz": "bat"\n  }\n}');
      });
      it('should insert new array values', function() {
        config = alce('{\n  foo:\n    // a comment\n    true\n}', {
          objectFormatter: function(parent, object) {
            object.indent = alce.calcIndent(parent.preamble);
            object.innerPrologue = '\n' + object.indent;
          },
          insertFormatter: function(parent, insert) {
            var indent = parent.indent || alce.calcIndent(parent.preamble);
            insert.preamble = (parent.children.length ? ',' : '') + '\n  ' + indent;
          },
          propertyFormatter: function(parent, property) {
            property.separator = ': ';
          }
        });
        config.set('bar', [1,2]);
        config.toString().should.equal('{\n  foo:\n    // a comment\n    true,\n  "bar": [\n    1,\n    2\n  ]\n}');
      });
    });
    describe('arrays', function() {
      var config;
      beforeEach(function() {
        config = alce('[\n    // a comment\n    true\n]');
      });

      it('should return values', function() {
        config.get(0).should.equal(true);
      });
      it('sold return complex values', function() {
        config = alce('[[\n    // a comment\n    true\n]]');
        config.get(0).get(0).should.equal(true);
      });
      it('should return length', function() {
        config.length.should.equal(1);
      });

      it('should update existing values', function() {
        config.set(0, false);
        config.toString().should.equal('[\n    // a comment\n    false\n]');
      });
      it('should update existing values with complex', function() {
        config.set(0, {foo: 'bar'});
        config.toString().should.equal('[\n    // a comment\n    {"foo":"bar"}\n]');
      });
      it('should insert new formatted values', function() {
        config = alce('[\n    // a comment\n    true\n]', {
          insertFormatter: function(parent, insert) {
            insert.preamble = (parent.children.length ? ',' : '') + '\n  ' + alce.calcIndent(parent.preamble);
          },
          propertyFormatter: function(parent, property) {
            property.separator = ': ';
          }
        });
        config.set(1, true);
        config.toString().should.equal('[\n    // a comment\n    true,\n  true\n]');
      });
      it('should insert new object values', function() {
        config = alce('[\n    // a comment\n    true\n]', {
          objectFormatter: function(parent, object) {
            object.indent = alce.calcIndent(parent.preamble) + (parent.isArray ? '  ' : '');
            object.innerPrologue = '\n' + object.indent;
          },
          insertFormatter: function(parent, insert) {
            var indent = parent.indent || alce.calcIndent(parent.preamble);
            insert.preamble = (parent.children.length ? ',' : '') + '\n  ' + indent;
          },
          propertyFormatter: function(parent, property) {
            property.separator = ': ';
          }
        });
        config.set(1, {foo: 'bar', baz: 'bat'});
        config.toString().should.equal('[\n    // a comment\n    true,\n  {\n    "foo": "bar",\n    "baz": "bat"\n  }\n]');
      });
      it('should insert new array values', function() {
        config = alce('[\n    // a comment\n    true\n]', {
          objectFormatter: function(parent, object) {
            object.indent = alce.calcIndent(parent.preamble) + (parent.isArray ? '  ' : '');
            object.innerPrologue = '\n' + object.indent;
          },
          insertFormatter: function(parent, insert) {
            var indent = parent.indent || alce.calcIndent(parent.preamble);
            insert.preamble = (parent.children.length ? ',' : '') + '\n  ' + indent;
          }
        });
        config.set(1, [1,2]);
        config.toString().should.equal('[\n    // a comment\n    true,\n  [\n    1,\n    2\n  ]\n]');
      });
    });
  });
});
