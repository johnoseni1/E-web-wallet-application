"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _gift = _interopRequireDefault(require("../models/gift"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _transactions = _interopRequireDefault(require("../models/transactions"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var router = _express["default"].Router();

var wallet_query = function wallet_query(query) {
  return _gift["default"].aggregate([{
    $match: query
  }, {
    $group: {
      _id: null,
      amount: {
        $sum: "$amount"
      }
    }
  }]);
};

router.get("/user/dashboard", _auth["default"], /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var total_funds_sent, total_funds_received, pending_transactions_count, transaction_history;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return wallet_query({
              senderId: _mongoose["default"].Types.ObjectId(req.user.id)
            });

          case 2:
            total_funds_sent = _context.sent;
            _context.next = 5;
            return wallet_query({
              receiverId: _mongoose["default"].Types.ObjectId(req.user.id)
            });

          case 5:
            total_funds_received = _context.sent;
            _context.next = 8;
            return _transactions["default"].countDocuments({
              userId: req.user.id,
              status: "pending"
            });

          case 8:
            pending_transactions_count = _context.sent;
            _context.next = 11;
            return _transactions["default"].find({
              userId: req.user.id
            }).sort({
              createdAt: -1
            });

          case 11:
            transaction_history = _context.sent;
            res.render("./account/dashboard", {
              name: req.user.full_name,
              title: "Dashboard",
              total_funds_sent: total_funds_sent,
              total_funds_received: total_funds_received,
              transaction_history: transaction_history,
              pending_transactions_count: pending_transactions_count
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get("/user/dashboard/transaction-history", _auth["default"], /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var transaction_details;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _transactions["default"].find({
              userId: req.user.id
            }).sort({
              createdAt: -1
            });

          case 2:
            transaction_details = _context2.sent;
            res.render("./account/transactions", {
              title: "Dashboard | Transactions",
              transaction_details: transaction_details,
              name: req.user.full_name
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.get("/user/dashboard/fund-wallet", _auth["default"], function (req, res, next) {
  return res.render("./account/fund-wallet", {
    name: req.user.full_name
  });
});
router.get("/user/dashboard/gift-history", _auth["default"], /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var gift_sent;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _gift["default"].find({
              senderId: req.user.id
            }).populate("receiverId").sort({
              createdAt: -1
            });

          case 2:
            gift_sent = _context3.sent;
            res.render("./account/gift-sent", {
              gift_sent: gift_sent
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.get("/user/dashboard/gift-received", _auth["default"], /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var gift_received;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _gift["default"].find({
              senderId: {
                $ne: req.user.id
              }
            }).populate("senderId").sort({
              createdAt: -1
            });

          case 2:
            gift_received = _context4.sent;
            res.render("./account/gift-received", {
              gift_received: gift_received
            });

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
router.get("/user/dashboard/gift/send-a-gift", _auth["default"], function (req, res, next) {
  return res.render("./account/send-a-gift");
});
var _default = router;
exports["default"] = _default;