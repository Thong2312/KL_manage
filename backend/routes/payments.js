const express = require('express');
const router = express.Router();
const paypal = require('../config/paypalConfig');

router.post('/create-payment', (req, res) => {
  const { amount, currency } = req.body;
  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "transactions": [{
      "amount": {
        "currency": currency,
        "total": amount
      },
      "description": "Mô tả giao dịch"
    }],
    "redirect_urls": {
      "return_url": "http://localhost:5000/api/payments/success",
      "cancel_url": "http://localhost:5000/api/payments/cancel"
    }
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      res.json({ paymentID: payment.id });
    }
  });
});

router.post('/execute-payment', (req, res) => {
  const { paymentID, payerID } = req.body;
  const execute_payment_json = {
    "payer_id": payerID
  };

  paypal.payment.execute(paymentID, execute_payment_json, (error, payment) => {
    if (error) {
      console.log(error.response);
      res.status(500).send(error);
    } else {
      res.json({ status: 'success', payment });
    }
  });
});

module.exports = router;
