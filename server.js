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

api.route('/')
  .get(function(req, res) {
    res.json({ message: 'Hello, beautiful! Welcome to the API.' });
  });

api.route('/authenticate')
  .post(function(req, res) {
    User.findOne({
      name: req.body.name
    }, function(err, user) {
      if (err){
        throw err;
      }
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          var token = jwt.sign(user, app.get('superSecret'), {
            expiresInMinutes: 1440
          });
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    });
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

api.route('/users/:user_id')
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err){
        res.send(err);
      }
      res.json(user);
    });
  })
  .put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err){
        res.send(err);
      }
      user.name = req.body.name;
      user.password = req.body.password;
      user.admin = req.body.admin;
      user.save(function(err) {
        if (err){
          res.send(err);
        }
        res.json({ message: 'User updated!' });
      });
    });
  })
  .delete(function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if (err){
        res.send(err);
      }
      res.json({ message: 'Successfully deleted' });
    });
  });

app.use('/api', api);

// ------ Serve
app.listen(port, function() {
  console.log('Running on port ' + port);
});
