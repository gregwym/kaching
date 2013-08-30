var express = require('express'),
    app = express(),
    kaching = require('kaching');

app.set('views', __dirname);
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'secret' }));
app.use(kaching.initialize());

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/kaching/paypal', function(req, res, next) {
  next();
}, kaching.create('paypal'));

app.listen(3000);
