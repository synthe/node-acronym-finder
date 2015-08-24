'use strict';

const baseUrl = 'http://www.nactem.ac.uk/software/acromine/dictionary.py';

var http = require('http'),
  url = require('url');

var proxyAgent = null;

if (process.env.http_proxy) {
  var HttpProxyAgent = require('http-proxy-agent');
  proxyAgent = new HttpProxyAgent(process.env.http_proxy);
}

function cleanResult(resultJson, limit) {
  var fullWords;

  if (!resultJson || resultJson.length === 0) {
    throw new Error('No results found');
  }

  fullWords = resultJson[0].lfs;

  if (limit) {
    if (isNaN(limit)) {
      throw new Error('limit must be an integer');
    }

    limit = parseInt(limit, 10);
    if (limit <= 0) {
      throw new Error('limit must be greater than 0');
    }

    fullWords = fullWords.slice(0, parseInt(limit, 10));
  }

  fullWords = fullWords.map(item => item.lf);

  return fullWords;
}

function cleanInput(acronym) {
  return encodeURIComponent(acronym.replace(/\./g, ''));
}

function request(acronym, limit) {
  var requestUrl = baseUrl + '?sf=' + cleanInput(acronym);
  var requestOptions = url.parse(requestUrl);

  if (proxyAgent) {
    requestOptions.agent = proxyAgent;
  }

  var acronymPromise = new Promise(function(resolve, reject) {
    http.get(requestOptions, function(res) {
      var body = '';

      res.on('data', function(chunk) {
        body += chunk;
      });

      res.on('end', function() {
        var acroJson;
        try {
          acroJson = JSON.parse(body);
          acroJson = cleanResult(acroJson, limit);
          resolve(acroJson);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', function(err) {
      reject(err);
    });
  });

  return acronymPromise;
}

module.exports = {
  request: request
};
