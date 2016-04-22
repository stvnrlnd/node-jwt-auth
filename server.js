'use strict';

// ------ Require packages
var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');
var morgan      = require('morgan');

// ------ Congifure application
var app         = express();
var api         = express.Router();
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

api.route('/users')
  .post(function(req, res) {
    var user = new User();
    user.name     = req.body.name;
    user.password = req.body.password;
    user.admin    = req.body.admin;
    user.save(function(err) {
      if (err){
        res.send(err);
      }
      res.json({ message: 'User created!' });
    });
  })
  .get(function(req, res) {
    User.find({}, function(err, users) {
      res.json(users);
    });
  });

app.use('/api', api);

// ------ Serve
app.listen(port, function() {
  console.log('Running on port ' + port);
});
