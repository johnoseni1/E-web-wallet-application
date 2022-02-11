"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _passportLocal = require("passport-local");

var _user = _interopRequireDefault(require("../models/user"));

//Serialize user
_passport["default"].serializeUser(function (user, done) {
  done(null, user.id);
}); //Deserialize user


_passport["default"].deserializeUser(function (id, done) {
  _user["default"].findById(id, function (err, user) {
    done(err, user);
  });
}); //Local Strategy


_passport["default"].use(new _passportLocal.Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
  _user["default"].findOne({
    email: email
  }, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, {
      message: 'Incorrect Username'
    });
    user.comparePassword(password, function (err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
    });
  });
}));

var _default = _passport["default"];
exports["default"] = _default;