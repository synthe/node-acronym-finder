/*global describe, it, before, after*/
'use strict';
require('harmonize')();

var path = require('path'),
  /*eslint-disable no-unused-vars */
  mocha = require('mocha'),
  /*eslint-enable no-unused-vars */
  chai = require('chai'),
  http = require('http'),
  chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

function getFixture(url, callback) {
  http.get(url, function(res) {
    var body = '';
    res.on('data', function(chunk) {
      body = body + chunk;
    });
    res.on('end', function() {
      var bodyJson;
      try {
        bodyJson = JSON.parse(body);
      } catch (e) {
        throw new Error('unable to decode json');
      }
      callback(bodyJson);
    });
  });
}

describe('REST API', function() {
  var theServer;
  before(function(done) {
    theServer = require(path.resolve(__dirname, '../server'));
    theServer.on('listening', function() {
      done();
    });
  });

  after(function() {
    theServer.close();
  });

  it('should send back a valid response', function(done) {
    var expected = {results: [
      'Federal Bureau of Investigation',
      'Frontal Behavioral Inventory',
      'fresh blood imaging',
      'foreign body infections'
    ]};
    // jscs:enable maximumLineLength
    getFixture('http://localhost:8000/fbi', function(bodyJson) {
      bodyJson.should.eql(expected);
      done();
    });
  });

  it('should correctly limit results', function(done) {
    var expected = {results: [
      'Federal Bureau of Investigation'
    ]};
    // jscs:enable maximumLineLength
    getFixture('http://localhost:8000/fbi?limit=1', function(bodyJson) {
      bodyJson.should.eql(expected);
      done();
    });
  });

  it('should fail on invalid limit value', function(done) {
    var expected = {
      code: 'BadRequestError',
      message: 'limit must be an integer'
    };
    // jscs:enable maximumLineLength
    getFixture('http://localhost:8000/fbi?limit=f', function(bodyJson) {
      bodyJson.should.eql(expected);
      done();
    });
  });

  it('should fail on an unfound acronym', function(done) {
    var expected = {
      code: 'BadRequestError',
      message: 'No results found'
    };
    // jscs:enable maximumLineLength
    getFixture('http://localhost:8000/qqqqqqq', function(bodyJson) {
      bodyJson.should.eql(expected);
      done();
    });
  });

});
