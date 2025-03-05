const paypal = require('paypal-rest-sdk');
require('dotenv').config();

// Cấu hình PayPal
paypal.configure({
  mode: 'sandbox', // Chuyển thành 'live' nếu deploy thật
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

module.exports = paypal;
