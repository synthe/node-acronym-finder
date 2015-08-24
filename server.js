'use strict';
require('harmonize')();
// this is a rest server implementation of the acronym library

var restify = require('restify'),
  acro = require('./lib/acronym');

var server = restify.createServer();

server.use(restify.queryParser());

function respond(req, res, next) {
  acro.request(req.params.acronym, req.query.limit || null)
    .then(function(fullWords) {
      res.send({results: fullWords});
      next();
    }).catch(function(err) {
      return next(new restify.BadRequestError(err.message || err));
    });
}

server.get('/:acronym', respond);
server.head('/:acronym', respond);

server.listen(8000, function() {
  console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;
