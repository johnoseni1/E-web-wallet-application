"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcryptNodejs = _interopRequireDefault(require("bcrypt-nodejs"));

var Schema = _mongoose["default"].Schema;
var userSchema = new Schema({
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone_number: {
    type: Number
  },
  isActivated: {
    type: Boolean,
    "default": false
  },
  virtual_account_id: String,
  balance: {
    type: Number,
    "default": 0
  },
  roleId: {
    type: String,
    "enum": ["user", "admin"],
    "default": "user"
  }
}, {
  timestamps: true
}); //Hash password with bcrypt before saving

userSchema.pre("save", function (next) {
  var user = this;
  var SALT_FACTOR = 12;
  if (!user.isModified("password")) return next();

  _bcryptNodejs["default"].genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    _bcryptNodejs["default"].hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  _bcryptNodejs["default"].compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var _default = _mongoose["default"].model("Users", userSchema);

exports["default"] = _default;