var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/OAuth2', function (err) {
    if (err) return console.log(err);
    console.log('Mongoose Connected');
});

var db = {};
db.OAuthAccessToken = require('./OAuthAccessToken')
db.OAuthAuthorizationCode = require('./OAuthAuthorizationCode')
db.OAuthClient = require('./OAuthClient')
db.OAuthRefreshToken = require('./OAuthRefreshToken')
db.OAuthScope = require('./OAuthScope')
db.User = require('./User')
db.Thing = require('./Thing')

module.exports = db;