var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressEjsLayouts = require("express-ejs-layouts");
const validateMiddleware = require("./middlewares/validate.middleware");
const indexMiddleware = require("./middlewares/index.middleware");
const dotenv = require("dotenv");
dotenv.config();

const flash = require("connect-flash");
const session = require("express-session");

var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    name: "f8_btvn",
    secret: "secretasfkbois",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 360000000000,
    },
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(validateMiddleware);
app.use(indexMiddleware);
app.use(expressEjsLayouts);

app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
