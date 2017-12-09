var crypto = require('crypto');
var auth = require('./face_sdk/auth');
var conf = require('./face_sdk/conf');
var http = require('http');

// API expired time (30 days)
var EXPIRED_SECONDS = 2592000;

// API configurations
const appId = '10110669';
const secretId = 'AKID65vwrbipAJC0c4hUP7g9RYTFsKaf2MzQ';
const secretKey = 'Yu42aCqrjw2viPvEQNaL5dxNjutkOq69';
const userId = '1043269994';

conf.setAppInfo(appId, secretId, secretKey, userId, 0);

// Generate API authorization key
// See: http://open.youtu.qq.com/#/develop/tool-authentication
function getAuthKey() {
  var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
  var key = auth.appSign(expired);
  return key;
}

// Construct request payload with given image and template
function constructPayload(image, template) {
  var payload = {
    'app_id': appId,
    'img_data': image,
    'rsp_img_type': "url",
    'opdata': [{
      'cmd': 'doFaceMerge',
      'params': {
        'model_id': template
      }
    }]
  };
  return JSON.stringify(payload);
}

function constructRequestOptions(payload) {
  const headers = {
    'Host': 'api.youtu.qq.com',
    'Content-Length': Buffer.byteLength(payload),
    'Content-Type': 'text/json',
    'Authorization': getAuthKey()
  };
  const options = {
    hostname: 'api.youtu.qq.com',
    path: '/cgi-bin/pitu_open_access_for_youtu.fcg',
    method: 'POST',
    headers: headers
  };
  return options;
}

/**
 * Generate merged image url with given image and template
 * @param {string} image Base64-encoded image
 * @param {string} template Template id to merge
 * @param {function (bool, string)} callback Should be called with (success, url)
 */
exports.faceFusion = function (image, template, callback) {
  const payload = constructPayload(image, template);
  const options = constructRequestOptions(payload);
  const req = http.request(options, function (res) {
    var body = "";
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      // Parse response body
      var data = JSON.parse(body);

      callback(false, data);
    });
  });

  req.on('error', function (err) {
    console.log('[ERROR] ' + err.message);
    callback(true, "");
  })

  // Write data to request body
  req.write(payload);
  req.end();
}
