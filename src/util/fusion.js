const http = require('http');
const templates = require('./templates')

function makeRequest(options, payload, callback) {
  const req = http.request(options, res => {
    var body = "";
    res.on('data', chunk => {
      body += chunk;
    });
    res.on('end', () => {
      // Parse response body
      const data = JSON.parse(body);
      callback(false, data.result);
    });
  });

  req.on('error', function (err) {
    console.log('[ERROR] ' + err.message);
    callback(true, "");
  });

  // Write data to request body
  req.write(payload);
  req.end();
}

/**
 * Generate merged image (base64-encoded) with given image and template
 * @param {string} image Base64-encoded image
 * @param {int} template Template id to merge (1~10)
 * @param {function (bool, string)} callback Should be called with (success, data)
 */
exports.faceFusion = function (image, template, callback) {
  const options = {
    hostname: 'https://api-cn.faceplusplus.com',
    path: '/imagepp/v1/mergeface',
    method: 'POST'
  };
  const postData = {
    'api_key': 'UgbTEz7_IQGn0vxyoY7V9udl5fZ3kJeM',
    'api_secret': 'oAEUY5ccrJ0nGIiy1h1kYLmB7B_85LJr',
    'template_url': templates[template-1].url,
    'template_rectangle': templates[template-1].faceRectangle,
    'merge_base64': image
  };
  makeRequest(options, JSON.stringify(postData), callback);
}
