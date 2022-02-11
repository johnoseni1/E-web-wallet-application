"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _paystack = require("../helpers/paystack");

var _transactions = _interopRequireDefault(require("../models/transactions"));

var _user = _interopRequireDefault(require("../models/user"));

var _crypto = _interopRequireDefault(require("crypto"));

var _gift = _interopRequireDefault(require("../models/gift"));

var _notification = _interopRequireDefault(require("../models/notification"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var router = _express["default"].Router(); // Funding of wallet


router.post("/payment/create", _auth["default"], /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var errors, paystack_data, payment_gateway_response, transation_payload;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            req.assert("amount", "Please enter the Amount you want to add into your wallet").notEmpty();
            errors = req.validationErrors();

            if (!errors) {
              _context.next = 5;
              break;
            }

            req.flash("success_msg", errors[0].msg);
            return _context.abrupt("return", res.redirect("back"));

          case 5:
            if (!(parseInt(req.body.amount) < 50)) {
              _context.next = 8;
              break;
            }

            req.flash("success_msg", "The least you can fund your wallet with is ₦50.");
            return _context.abrupt("return", res.redirect("back"));

          case 8:
            // payload to send to paystack to initialize a transaction
            paystack_data = {
              amount: parseInt(req.body.amount) * 100,
              email: req.user.email,
              reference: _crypto["default"].randomBytes(4).toString("hex")
            };
            _context.next = 11;
            return (0, _paystack.initializePayment)(paystack_data);

          case 11:
            payment_gateway_response = _context.sent;
            transation_payload = {
              userId: req.user.id,
              amount: parseInt(req.body.amount),
              status: "pending",
              reference: paystack_data.reference,
              access_code: payment_gateway_response.data.access_code
            };
            _context.next = 15;
            return _transactions["default"].create(transation_payload);

          case 15:
            if (payment_gateway_response) res.redirect(301, payment_gateway_response.data.authorization_url);

          case 16:
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
router.get("/payment/verify", _auth["default"], /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var trxref, payment_status, _payment_status$data$, status, ip_address, reference, currency, channel, transaction_id, notification_payload;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            trxref = req.query.trxref;

            if (trxref) {
              _context2.next = 4;
              break;
            }

            req.flash("success_msg", "Transaction reference not found");
            return _context2.abrupt("return", res.redirect("/user/dashboard"));

          case 4:
            _context2.next = 6;
            return (0, _paystack.verifyPayment)(trxref);

          case 6:
            payment_status = _context2.sent;
            _payment_status$data$ = payment_status.data.data, status = _payment_status$data$.status, ip_address = _payment_status$data$.ip_address, reference = _payment_status$data$.reference, currency = _payment_status$data$.currency, channel = _payment_status$data$.channel;
            _context2.next = 10;
            return _transactions["default"].updateOne({
              userId: req.user.id,
              reference: reference
            }, {
              $set: {
                status: status
              },
              ip_address: ip_address,
              reference: reference,
              currency: currency,
              channel: channel
            });

          case 10:
            _context2.next = 12;
            return _transactions["default"].findOne({
              userId: req.user.id,
              reference: reference
            });

          case 12:
            transaction_id = _context2.sent;

            if (!(status == "success")) {
              _context2.next = 23;
              break;
            }

            _context2.next = 16;
            return _user["default"].updateOne({
              _id: req.user.id
            }, {
              $inc: {
                balance: transaction_id.amount
              }
            });

          case 16:
            // create a notfication for the user that a money has been credited into their account
            notification_payload = {
              receiverId: req.user.id,
              content: "\u20A6".concat(transaction_id.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"), " has been deposited into your Wallet!.")
            };
            _context2.next = 19;
            return _notification["default"].create(notification_payload);

          case 19:
            req.flash("success_msg", "Transaction Successfull. The amount of " + transaction_id.amount + " has been funded in your wallet");
            return _context2.abrupt("return", res.redirect("/user/dashboard"));

          case 23:
            req.flash("success_msg", "Transaction Unsuccessfull");
            return _context2.abrupt("return", res.redirect("/user/dashboard"));

          case 25:
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
/**
 * sending of virtual money. You can send money to a user via their virtual_account_id
 * the virtual_account_id looks like an account number, you can ask that from the user
 * you can also send money to a user via their email.
 * @param {String} recepient Recepient can be email or a virtual account ID
 * @param {Number} amount
 */

router.post("/transfer/create", _auth["default"], /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var errors, _req$body, amount, recepient, transaction_remark, receiver, user_has_enough_balance, sender_current_balance, notification_payload;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // check if the recepient and amount field is not empty
            req.assert("recepient", "Pls enter the receiver's email or virtual account ID").notEmpty();
            req.assert("amount", "Pls enter the amount you will like to Gift out").notEmpty();
            errors = req.validationErrors();

            if (!errors) {
              _context3.next = 6;
              break;
            }

            req.flash("success_msg", errors[0].msg);
            return _context3.abrupt("return", res.redirect("back"));

          case 6:
            // search the database for the user either with the email or the virtal account id, skip the logged in userId (sender ID)
            _req$body = req.body, amount = _req$body.amount, recepient = _req$body.recepient, transaction_remark = _req$body.transaction_remark;
            _context3.next = 9;
            return _user["default"].findOne({
              _id: {
                $ne: req.user.id
              },
              $or: [{
                email: recepient
              }, {
                virtual_account_id: recepient
              }]
            });

          case 9:
            receiver = _context3.sent;

            if (receiver) {
              _context3.next = 13;
              break;
            }

            req.flash("success_msg", "The Receiver's account was not found, You can try again.");
            return _context3.abrupt("return", res.redirect("back"));

          case 13:
            // if user was found, check if the sender has up to the amount they want to transfer in their acc
            user_has_enough_balance = req.user.balance >= parseInt(amount); // if user has enough balance, make the transer, Update the sender's balance else, send a message back to the user

            if (!user_has_enough_balance) {
              _context3.next = 31;
              break;
            }

            _context3.next = 17;
            return _gift["default"].create({
              senderId: req.user.id,
              receiverId: receiver._id,
              amount: parseInt(amount),
              transaction_remark: transaction_remark
            });

          case 17:
            _context3.next = 19;
            return _user["default"].findById(req.user.id);

          case 19:
            sender_current_balance = _context3.sent;
            _context3.next = 22;
            return _user["default"].updateOne({
              _id: req.user.id
            }, {
              $set: {
                balance: sender_current_balance.balance - parseInt(amount)
              }
            });

          case 22:
            _context3.next = 24;
            return _user["default"].updateOne({
              _id: receiver._id
            }, {
              $inc: {
                balance: parseInt(amount)
              }
            });

          case 24:
            // send a notification to the receiver that they have been gifted money, incase they see an additional money in their wallet balance.
            notification_payload = {
              receiverId: receiver._id,
              content: "\u20A6".concat(parseInt(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"), " has been sent to you as a gift from ").concat(sender_current_balance.full_name)
            };
            _context3.next = 27;
            return _notification["default"].create(notification_payload);

          case 27:
            req.flash("success_msg", "Transfer Successfull. Your wallet balance has been updated.");
            return _context3.abrupt("return", res.redirect("back"));

          case 31:
            req.flash("success_msg", "Insufficient funds. You don't have enough money in your wallet to make this transfer. Try funding your wallet to continue");
            return _context3.abrupt("return", res.redirect("back"));

          case 33:
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
var _default = router;
exports["default"] = _default;