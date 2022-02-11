"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  amount: Number,
  reference: String,
  currency: String,
  channel: String,
  ip_address: String,
  status: {
    type: String,
    "enum": ["pending", "success", "error"],
    "default": "pending"
  },
  access_code: String
}, {
  timestamps: true
});

var _default = _mongoose["default"].model("Transactions", transactionSchema);

exports["default"] = _default;