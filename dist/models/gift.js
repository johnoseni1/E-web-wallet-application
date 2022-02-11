"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var walletSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  amount: Number,
  transaction_remark: String
}, {
  timestamps: true
});

var _default = _mongoose["default"].model("Wallet", walletSchema);

exports["default"] = _default;