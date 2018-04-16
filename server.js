var http = require('http');
var express = require('express'),
    app = module.exports.app = express(),
    server = http.createServer(app),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    port = 8080;

app.use(express.static('./dist/www'));

// configure Express
app.use(cookieParser());
app.use(session({ secret: 'kdasdf8232@#(W*asd9',
                  saveUninitialized: true,
                  resave: true }));

server.listen(port);  //listen on port 8080
console.log("Listening on port " + port);