var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var { Sequelize, sequelize } = require('./models/index.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// Test connection to database
(async () => {
  await sequelize.sync();

  try {
    await sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error(`Unable to connect to the database: ${error}`);
    });
  }
  catch (error) {

  }

})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  console.log('404 Handler');

  const err = new Error("Sorry! We couldn't find the page you were looking for");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log('Global Handler')
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500)
  // res.render('error');
  
  if (err.status === 404) {
    res.render('page_not_found', { title: "Page Not Found", error: err });
  }
  else if (err.status === undefined) {
    err.status = 500;
    err.message = 'Sorry! There was an unexpected error on the server.';
    res.render('error', { title: "Page Not Found", error: err });
  }
});

module.exports = app;
