const db = require('../config/db');

const Payment = {
  create: (payment, callback) => {
    const { orderId, amount, paymentMethod, status, transactionId } = payment;
    db.query(
      'INSERT INTO payments (orderId, amount, paymentMethod, status, transactionId) VALUES (?, ?, ?, ?, ?)',
      [orderId, amount, paymentMethod, status, transactionId],
      callback
    );
  },

  getPaymentByOrder: (orderId, callback) => {
    db.query('SELECT * FROM payments WHERE orderId = ?', [orderId], callback);
  }
};

module.exports = Payment;
