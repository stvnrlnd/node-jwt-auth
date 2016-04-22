'use strict';
var express     = require('express');
var jwt         = require('jsonwebtoken');

var app         = express();
var api         = express.Router();
var config      = require('./config');
var User        = require('./models/user');

app.set('superSecret', config.secret);

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

api.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
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

module.exports = api;
