var oauthServer = require('oauth2-server');

var oauth = new oauthServer({
    model: require('./mongo-models.js')
});

module.exports = oauth;