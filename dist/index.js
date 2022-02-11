"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _path = _interopRequireDefault(require("path"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _helmet = _interopRequireDefault(require("helmet"));

var _passport = _interopRequireDefault(require("./config/passport"));

var _expressValidator = _interopRequireDefault(require("express-validator"));

var _index = _interopRequireDefault(require("./routes/index"));

var _transactions = _interopRequireDefault(require("./routes/transactions"));

var _user = _interopRequireDefault(require("./routes/user"));

var _account = _interopRequireDefault(require("./routes/account"));

var MongoStore = require("connect-mongo")(_expressSession["default"]); // Load environment variables from.env file, where API keys and passwords are configured.


_dotenv["default"].config({
  path: "./.env"
});

var app = (0, _express["default"])();
var port = process.env.PORT || 5000;
app.listen(port, function () {
  return console.log("App Listening on port: " + port);
}); //Load views directory and view engine

app.set("views", _path["default"].join(__dirname, "views"));
app.set("view engine", "ejs"); // Mongoose options

var options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};

_mongoose["default"].connect(process.env.MONGODB_URL, options).then(function () {
  return console.log("Database connection established");
})["catch"](function (err) {
  return console.error("There was an error connecting to database, the err is ".concat(err));
});

app.use((0, _helmet["default"])());
app.use((0, _morgan["default"])("dev"));
app.use(_express["default"].json({
  limit: "900mb"
}));
app.use(_express["default"].urlencoded({
  extended: false,
  limit: "900mb"
}));
app.use((0, _expressValidator["default"])());
app.use((0, _cookieParser["default"])());
app.use((0, _expressSession["default"])({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1209600000
  },
  store: new MongoStore({
    url: process.env.MONGODB_URL,
    autoReconnect: true
  })
})); // Passport middleware

app.use(_passport["default"].initialize());
app.use(_passport["default"].session()); //Set the public folder

app.use(_express["default"]["static"](_path["default"].join(__dirname, "public")));
app.use(_index["default"]);
app.use(_transactions["default"]);
app.use(_user["default"]);
app.use(_account["default"]); //Error handling

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render("error");
});
var _default = app;
exports["default"] = _default;