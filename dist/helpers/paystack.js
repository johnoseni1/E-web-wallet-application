"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

/**
 * Initialize paystack transaction. create an Object with all the params below included in it.
 * @param {Number} amount (required).
 * @param {String} email Logged in user's email (required).
 * @param {String} reference A random number generated to track transactions (optional).
 * @returns {Object} this.data.authorization_url. The URL the payment will be made.
 */
exports.initializePayment = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(form) {
    var options;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = {
              url: "https://api.paystack.co/transaction/initialize",
              headers: {
                authorization: "Bearer ".concat(process.env.PAYSTACK_SECRET_KEY),
                "content-type": "application/json",
                "cache-control": "no-cache"
              },
              method: "POST",
              data: form
            };
            return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
                var response;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return _axios["default"].request(options);

                      case 3:
                        response = _context.sent;
                        resolve(response.data);
                        _context.next = 10;
                        break;

                      case 7:
                        _context.prev = 7;
                        _context.t0 = _context["catch"](0);
                        reject(_context.t0);

                      case 10:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 7]]);
              }));

              return function (_x2, _x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Verify all transactions before updating their status in the DB
 * @param {String} trxref The reference String to verify the transaction. It will be gotten after successfully
 * initializing a transaction.
 */


exports.verifyPayment = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(ref) {
    var options;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            options = {
              url: "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
              headers: {
                authorization: "Bearer ".concat(process.env.PAYSTACK_SECRET_KEY),
                "content-type": "application/json",
                "cache-control": "no-cache"
              },
              method: "GET"
            };
            return _context4.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(resolve, reject) {
                var data;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return _axios["default"].request(options);

                      case 3:
                        data = _context3.sent;
                        resolve(data);
                        _context3.next = 10;
                        break;

                      case 7:
                        _context3.prev = 7;
                        _context3.t0 = _context3["catch"](0);
                        reject(_context3.t0);

                      case 10:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[0, 7]]);
              }));

              return function (_x5, _x6) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x4) {
    return _ref3.apply(this, arguments);
  };
}();