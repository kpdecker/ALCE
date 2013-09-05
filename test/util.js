var util = require('../lib/util');

describe('util', function() {
  describe('#extractRange', function() {
    it('should return range excluding wrapper', function() {
      util.extractRange('foobarfoo', [4, 7]).should.equal('bar');
      util.extractRange('foobarfoo', [0, 7]).should.equal('foobar');
      util.extractRange('foobarfoo', [4, 20]).should.equal('barfoo');
    });
    it('should handle empty or negative ranges', function() {
      util.extractRange('foobarfoo', [2, 2]).should.equal('');
      util.extractRange('foobarfoo', [2, -2]).should.equal('');
    });
  });
});
