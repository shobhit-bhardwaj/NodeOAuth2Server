var express = require('express');
var oauthServer = require('oauth2-server');
var bodyParser = require('body-parser');
var Request = oauthServer.Request;
var Response = oauthServer.Response;
var authenticate = require('./server/oAuth/authenticate')

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var oauth = new oauthServer({
    model: require('./server/oAuth/mongo-models')
});


/*
POST /oauth/token HTTP/1.1
Host: localhost:3000
Content-Type: application/x-www-form-urlencoded
Authorization: Basic ZGVtb2NsaWVudDpkZW1vY2xpZW50c2VjcmV0
Cache-Control: no-cache
Postman-Token: 2c78f004-6a0a-907b-4107-bda55ad74958
grant_type=password&username=admin&password=admin
 */
app.all('/oauth/token', function (request, response, next) {
    oauth.token(new Request(request), new Response(response))
        .then(function (token) {
            return response.json(token)
        })
        .catch(function (error) {
            console.log(error);
            return response.status(500).json(err)
        });
});

app.post('/authorise', function (request, response) {
    return oauth.authorize(new Request(request), new Response(response)).then(function (success) {
        response.json(success)
    }).catch(function (error) {
        response.status(error.code || 500).json(error);
    })
});

app.get('/secure', authenticate(), function (request, response) {
    response.json({message: 'Secure data'});
});

app.get('/me', authenticate(), function (request, response) {
    response.json({
        me: request.user,
        messsage: 'Authorization success, Without Scopes, Try accessing /profile with `profile` scope',
        description: 'Try postman https://www.getpostman.com/collections/37afd82600127fbeef28',
        more: 'pass `profile` scope while Authorize'
    });
});

app.get('/profile', authenticate({scope: 'profile'}), function (request, response) {
    response.json({
        profile: request.user
    })
});

app.listen(3000, function (error) {
    if (error)
        console.log('Error is Starting Server');
    else
        console.log('Starting Server at Port - 3000');
});