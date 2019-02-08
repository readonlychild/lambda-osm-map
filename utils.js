var utils = {
  apiBinaryResponse: function (contentType, data) {
    var response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType
      },
      body: data.toString("base64"),
      isBase64Encoded: true
    };
    return response;
  }
};

module.exports = utils;
