var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var depenseRoute = require('./routes/depense');
var approRoute = require('./routes/appro');
var ligneApproRoute = require('./routes/ligneAppro');
var ligneVenteRoute = require('./routes/ligneVente');
var personnelRoute = require('./routes/personnel');
var produitRoute = require('./routes/produit')
var stockRoute = require('./routes/stock')
var venteRoute = require('./routes/vente');
var auth = require('./routes/authentification');
const PORT = 3000;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/vente', venteRoute);
app.use('/api/appro', approRoute);
app.use('/api/depense', depenseRoute);
app.use('/api/ligneAppro', ligneApproRoute);
app.use('/api/ligneVente', ligneVenteRoute);
app.use('/api/personnel', personnelRoute);
app.use('/api/produit', produitRoute);
app.use('/api/stock', stockRoute);
app.use('/api/authentification', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, function () {
  console.log(`le serveur est lancé sur le port ${PORT}`)
})

module.exports = app;
