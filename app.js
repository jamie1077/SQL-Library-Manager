const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sequelize = require('./models').sequelize;

//Routes
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

const app = express();

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

//logs messages to console if connection and sync were successful
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to db was successful');
  } 
  catch (error) 
  { 
    console.error('There was a connection Error', error);
  }
 
  try {
    await sequelize.sync();

    console.log('Sync was successful');
  } catch (error) {

    console.error('There was a sync error', error);
  }
    
})();

const port = 3000;

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  const err = new createError.NotFound()
  next(err)
});

// error handler
app.use( (err, req, res, next) => {
  if(err){
    console.log(err)
    if(err.status === 404) {
      res.render("page-not-found", {err});
    }else{
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error", {err});
    }
  }

});


module.exports = app;
