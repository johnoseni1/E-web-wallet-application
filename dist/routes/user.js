"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _passport = _interopRequireDefault(require("../config/passport"));

var _user = _interopRequireDefault(require("../models/user"));

var _crypto = _interopRequireDefault(require("crypto"));

var router = _express["default"].Router();

// Sign up page
router.post("/sign-up", /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var errors, account_id, _req$body, email, full_name, password, _req$body$virtual_acc, virtual_account_id, _req$body$roleId, roleId, email_exist;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // check the body for empty fields
            req.assert("email", "Email Field is Compulsory").notEmpty();
            req.assert("full_name", "Full name Field is Compulsory").notEmpty();
            req.assert("password", "Password Field is Compulsory").notEmpty();
            errors = req.validationErrors();

            if (!errors) {
              _context.next = 7;
              break;
            }

            req.flash("success_msg", errors[0].msg);
            return _context.abrupt("return", res.redirect("back"));

          case 7:
            // Generate a 12 random virtual account ID for each user
            account_id = _crypto["default"].randomBytes(6).toString("hex");
            _req$body = req.body, email = _req$body.email, full_name = _req$body.full_name, password = _req$body.password, _req$body$virtual_acc = _req$body.virtual_account_id, virtual_account_id = _req$body$virtual_acc === void 0 ? account_id : _req$body$virtual_acc, _req$body$roleId = _req$body.roleId, roleId = _req$body$roleId === void 0 ? "user" : _req$body$roleId; // check if the email coming from the body exist

            _context.next = 11;
            return _user["default"].findOne({
              email: email
            });

          case 11:
            email_exist = _context.sent;

            if (!email_exist) {
              _context.next = 15;
              break;
            }

            req.flash("success_msg", "This Email has been used");
            return _context.abrupt("return", res.redirect("back"));

          case 15:
            _context.next = 17;
            return _user["default"].create({
              email: email,
              full_name: full_name,
              password: password,
              virtual_account_id: virtual_account_id,
              roleId: roleId
            });

          case 17:
            req.flash("success_msg", "Registration Successfull");
            return _context.abrupt("return", res.redirect("back"));

          case 19:
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
router.post("/login", /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _passport["default"].authenticate("local", function (err, user, info) {
              if (err) return next(err);

              if (!user) {
                req.flash("success_msg", "Incorect Email or password");
                return res.redirect("back");
              }

              req.logIn(user, function (err) {
                if (err) return next(err);

                switch (req.user.roleId) {
                  case "user":
                    return res.redirect("/user/dashboard");
                    break;

                  case "admin":
                    return res.redirect("/admin/dashboard");
                    break;

                  default:
                    return res.redirect("/user/dashboard");
                    break;
                }
              });
            })(req, res, next);

          case 1:
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
router.get("/log-out", function (req, res, next) {
  req.logOut();
  req.flash("success_msg", "Login to Continue.");
  return res.redirect("/login");
});
module.exports = router;