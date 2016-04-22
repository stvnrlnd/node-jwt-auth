'use strict';

// ------ Require packages
var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');
var morgan      = require('morgan');

// ------ Congifure application
var app         = express();
var port        = process.env.PORT || 3000;
var config      = require('./resource/config');
var User        = require('./resource/models/user');

mongoose.connect(config.dbURL);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// ------ Build routes
app.get('/', function(req, res) {
  res.send('Hello, beautiful!');
});

// ------ Serve
app.listen(port, function() {
  console.log('Running on port ' + port);
});
