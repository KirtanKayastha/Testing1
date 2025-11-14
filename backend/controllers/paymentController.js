const Payment = require('../models/paymentModel');

const createPayment = (req, res) => {
  Payment.create(req.body, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Payment recorded', paymentId: results.insertId });
  });
};

const getPayment = (req, res) => {
  Payment.getPaymentByOrder(req.params.orderId, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};

module.exports = { createPayment, getPayment };
