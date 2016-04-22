'use strict';

// ------ Require packages
var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');

var morgan      = require('morgan');

// ------ Congifure application
var app         = express();
var port        = process.env.PORT || 3000;
var config      = require('./resource/config');
var api         = require('./resource/APIroutes');


mongoose.connect(config.dbURL);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api', api);

// ------ Build routes
app.get('/', function(req, res) {
  res.send('Hello, beautiful!');
});



// ------ Serve
app.listen(port, function() {
  console.log('Running on port ' + port);
});
