var oauthServer = require('oauth2-server');
var Request = oauthServer.Request;
var Response = oauthServer.Response;
var db = require('./mongodb');
var oauth = require('./oauth')

module.exports = function (app) {
    app.all('/oauth/token', function (req, res, next) {
        var request = new Request(req);
        var response = new Response(res);

        oauth
            .token(request, response)
            .then(function (token) {
                return res.json(token)
            }).catch(function (err) {
            return res.status(500).json(err)
        })
    });

    app.post('/authorise', function (req, res) {
        var request = new Request(req);
        var response = new Response(res);

        return oauth.authorize(request, response).then(function (success) {
            res.json(success)
        }).catch(function (err) {
            res.status(err.code || 500).json(err)
        })
    });

    app.get('/authorise', function (req, res) {
        return db.OAuthClient.findOne({
            where: {
                client_id: req.query.client_id,
                redirect_uri: req.query.redirect_uri,
            },
            attributes: ['id', 'name'],
        })
            .then(function (model) {
                if (!model) return res.status(404).json({error: 'Invalid Client'});
                return res.json(model);
            }).catch(function (err) {
                return res.status(err.code || 500).json(err)
            });
    });
}