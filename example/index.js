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
  // Proceed to next step
  next();
}, kaching.create('paypal', {
  // Redirect URL is mandatory for paypal payment.
  redirect_urls: {
    return_url: 'http://localhost:3000/kaching/paypal/return',
    cancel_url: 'http://localhost:3000/kaching/paypal/cancel'
  },
  // We have a request handler coming after, so set `passToNext` to true
  passToNext: true
}), function(req, res) {
  console.log(JSON.stringify(req.payment));
});

app.get('/session', function(req, res) {
  res.json(req.session);
});

app.listen(3000);
