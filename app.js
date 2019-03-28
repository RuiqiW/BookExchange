const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const logger = require('morgan');

const routes = require('./routes/index');

const app = express();

// Set up mongoose connection
const mongoose = require('./db/mongoose');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(logger('dev'));
// don't need body-parser: https://stackoverflow.com/questions/47232187/express-json-vs-bodyparser-json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true
  }
}));

// Static directories
app.use(express.static(path.join(__dirname, 'public')));
app.use("/pages", express.static(__dirname + '/public/pages'));
app.use("/styles", express.static(__dirname + '/public/styles'));
app.use("/scripts", express.static(__dirname + '/public/scripts'));

// let the routes router handle all the routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.redirect('/404');
});

module.exports = app;
