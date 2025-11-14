const db = require('../config/db');

const Cart = {
  addItem: (cartItem, callback) => {
    const { userId, productId, quantity } = cartItem;
    db.query(
      'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity],
      callback
    );
  },

  getCartByUser: (userId, callback) => {
    db.query(
      'SELECT cart.id, cart.productId, products.name, products.price, products.image, cart.quantity FROM cart JOIN products ON cart.productId = products.id WHERE cart.userId = ?',
      [userId],
      callback
    );
  },

  getCartCountByUser: (userId, callback) => {
    db.query(
      'SELECT COALESCE(SUM(quantity), 0) AS count FROM cart WHERE userId = ?',
      [userId],
      callback
    );
  },

  removeItem: (cartId, callback) => {
    db.query('DELETE FROM cart WHERE id = ?', [cartId], callback);
  }
};

module.exports = Cart;
