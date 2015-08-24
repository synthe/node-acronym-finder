/*global describe, it*/
'use strict';
require('harmonize')();

var path = require('path'),
  /*eslint-disable no-unused-vars */
  mocha = require('mocha'),
  /*eslint-enable no-unused-vars */
  chai = require('chai'),
  chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

var acronym = require(path.resolve(__dirname, '../lib/acronym'));

describe('Acronym methods', function() {
  describe('request', function() {
    this.timeout(5000);

    it('should return a promise', function() {
      acronym.request('fbi').should.be.an.instanceOf(Promise);
    });

    it('should get an acronym correctly', function(done) {
      var acroPromise = acronym.request('fbi');
      var expected = [
        'Federal Bureau of Investigation',
        'Frontal Behavioral Inventory',
        'fresh blood imaging',
        'foreign body infections'
      ];
      acroPromise.should.eventually.eql(expected).and.notify(done);
    });

    it('should be able to limit results', function(done) {
      var acroPromise = acronym.request('fbi', 2);
      acroPromise.should.eventually.have.length(2).and.notify(done);
    });

    it('should fail on invalid limit values', function(done) {
      var acroPromise = acronym.request('fbi', 'qq');
      acroPromise.should.be.rejected.and.notify(done);
    });

    it('should fail on negative limit values', function(done) {
      var acroPromise = acronym.request('fbi', -10);
      acroPromise.should.be.rejected.and.notify(done);
    });

    it('should fail on an acronym that does not exist', function(done) {
      var acroPromise = acronym.request('qwertasdfg', -10);
      acroPromise.should.be.rejected.and.notify(done);
    });
  });
});
