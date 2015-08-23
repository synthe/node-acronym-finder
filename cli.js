'use strict';
require('harmonize')();
// this is a command line implementation of the acronym library
// usage:
//   node --harmony cli fbi --limit=2
//   --limit is optional
// limit must be passed before acronyms

var minimist = require('minimist'),
  acronym = require('./lib/acronym');

var argv = minimist(process.argv.slice(2));

if (!argv._ || !argv._.length) {
  throw new Error('You have not passed any acronyms to search');
}

function handleResponse(acro, results) {
  console.log('Results for: ', acro);
  results.forEach(item => console.log(' - ', item));
}

function handleError(acro, err) {
  console.log('Error for term: ', acro);
  console.log(' - ', err.message);
}

for (let acro of argv._) {
  /*eslint-disable no-loop-func */
  acronym.request(acro, argv.limit || null)
    .then(results => handleResponse(acro, results))
    .catch(err => handleError(acro, err));
  /*eslint-enable no-loop-func */
}
