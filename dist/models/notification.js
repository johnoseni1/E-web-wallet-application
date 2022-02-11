"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var notificationSchema = new Schema({
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  content: String,
  status: {
    type: String,
    "enum": ["delivered", "read"],
    "default": "delivered"
  }
}, {
  timestamps: true
});

var _default = _mongoose["default"].model("Notification", notificationSchema);

exports["default"] = _default;