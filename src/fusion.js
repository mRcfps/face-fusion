var crypto = require('crypto');
var http = require('http');

// API expired time (30 days)
var EXPIRED_SECONDS = 2592000;

// API configurations
const appId = '';
const secretId = '****';
const secretKey = '****';
const userId = '****';

// Generate API authorization key
// See: http://open.youtu.qq.com/#/develop/tool-authentication
function getAuthKey() {
  var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
  var now = parseInt(Date.now() / 1000);
  var rdm = parseInt(Math.random() * Math.pow(2, 32));
  var original = 'u=' + qq + 'a=' + appId + '&k=' + secretId + '&e=' + expired +
                 '&t=' + now + '&r=' + rdm + '&f=';
  var data = new Buffer(plainText,'utf8');
  var res = crypto.createHmac('sha1',secretKey).update(data).digest();
  var bin = Buffer.concat([res,data]);
  var key = bin.toString('base64');

  return key;
}

// Construct request payload with given image and template
function constructPayload(image, template) {
  var payload = {
    'img_data': image,
    'rsp_img_type': "url",
    'opdata': [{
      'cmd': 'doFaceMerge',
      'params': {
        'model_id': template
      }
    }]
  };
  return payload;
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
      var content = JSON.parse(body);

      if (content.ret != 0) {
        // youtu API request failed
        console.log('[ERROR] youtu API request failed: ' + content.msg);
        callback(false, "");
      } else {
        callback(true, body.img_url);
      }
    });
  });

  req.on('error', function (err) {
    console.log('[ERROR] ' + err.message);
    callback(false, "");
  })

  // Write data to request body
  req.write(payload);
  req.end();
}
