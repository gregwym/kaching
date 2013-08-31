var express = require('express'),
    app = express(),
    PaypalStrategy = require('kaching-paypal'),
    kaching = require('kaching');

app.set('views', __dirname);
app.set('view engine', 'jade');

/**
 * Test account: kaching@gmail.com
 * Password: kachingtest
 */
kaching.use(new PaypalStrategy({
  'client_id': 'AVNKWRCWeT5AB6KEzKD28qyLwAl5rGi8vt3jtWpZtx--ybYDUjFivZd3EP9-',
  'client_secret': 'EAiZrRC51hz6ixu7On34zHnAFYB6jgZfVoBoz15aWei3nvM1MSDidZaT1GF0'
}));

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
  // Construct payment detail in `req.payment`
  req.payment = {
    // Payment amount, with optional details
    amount:{
      total:'7.47',
      currency:'USD',
      details: {
        shipping: '1.00',
        subtotal: '6.00',
        tax: '0.47'
      }
    },
    // Item list, optional
    item_list: {
      items: [
        { name: 'Product', price: '3', quantity: '2', currency: 'USD' }
      ]
    },
    // Payment transaction description
    description:'Kaching paypal test transaction'
  };
  // Proceed to create the payment
  next();
}, kaching.create('paypal', {
  // Redirect URL is mandatory for paypal payment.
  // You can also specify the redirect_urls for each payment.
  redirect_urls: {
    return_url: 'http://localhost:3000/kaching/paypal/return',
    cancel_url: 'http://localhost:3000/kaching/paypal/cancel'
  }
}), function(req, res, next) {
  // Payment has been created, save it in the session for later reference.
  console.log(JSON.stringify(req.payment));
  req.session.payment = req.payment;
  // Proceed to the approval process
  next();
}, kaching.approve('paypal'));

app.get('/kaching/paypal/return', function(req, res, next) {
  // Prepare payment information and payerId
  req.payment = req.session.payment;
  req.payment.payer_id = req.query.PayerID;
  next();
}, kaching.execute('paypal'), function(req, res) {
  req.session.payment = req.payment;
  res.redirect('/payment/result');
});

app.get('/payment/result', function(req, res) {
  res.json(req.session.payment);
});

app.get('/session', function(req, res) {
  res.json(req.session);
});

app.listen(3000);
