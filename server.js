var express = require('express');
var app = express();
var http = require('http');
var httpServer =    http.Server(app);
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var request = require('request');
var apiAiUrl = "https://api.api.ai/v1/query?v=20150910";
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Content-Security-Policy', 'frame-ancestors https://*.maxlifeinsurance.com');
    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
};

app.use(allowCrossDomain);

app.use(express.static('./'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/cs.html');
});



var botResponse;
var accessToken;
app.post('/postdata',  function (req, res) {
  var queryData  =  JSON.stringify({query: req.body.query, lang: "en", sessionId: req.body.randomString});
//  console.log("Query=", queryData);

  accessToken = "eccdf4ef216b40b688df947557977462";         
  console.log(accessToken);

    request({
            url: apiAiUrl,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" +" "+accessToken,
            },
            body: queryData,
        }, function callback(error, response, body) {
            if (!error && response && response.statusCode == 200) {
                botResponse = JSON.parse(body);
                 console.log(botResponse);
                res.send(botResponse);
            }
            else{
                console.log("there is error")
                res.status(400);
            }
        });
});

httpServer.listen(port, function() {
    console.log('App is listening on :' + port);
});
