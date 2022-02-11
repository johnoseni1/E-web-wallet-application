"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

/**
 * Disable unauthencticated users from accessing the dashboard pages
 */
function _default(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("success_msg", "Pls Login to continue");
  res.redirect("/login");
}