const db = require('../config/db');

const Order = {
  create: (order, callback) => {
    const { userId, productId, quantity, totalPrice, paymentMethod, status } = order;
    db.query(
      'INSERT INTO orders (userId, productId, quantity, totalPrice, paymentMethod, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, productId, quantity, totalPrice, paymentMethod || 'COD', status || 'Pending'],
      callback
    );
  },

 getOrdersByUser: (userId, callback) => {
  db.query(
    'SELECT orders.id, products.name, products.price, products.image, orders.quantity, orders.totalPrice, orders.status FROM orders JOIN products ON orders.productId = products.id WHERE orders.userId = ?',
    [userId],
    callback
  );
}

};

module.exports = Order;
