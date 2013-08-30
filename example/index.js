var express = require('express'),
    app = express(),
    cashier = require('../index');

app.set('views', __dirname);
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'secret' }));
app.use(cashier.initialize());

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/cashier/paypal', function(req, res, next) {
  next();
}, cashier.create('paypal'));

app.listen(3000);
