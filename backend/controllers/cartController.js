const Cart = require('../models/cartModel');

const addToCart = (req, res) => {
  Cart.addItem(req.body, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Item added to cart', cartId: results.insertId });
  });
};

const getCart = (req, res) => {
  const userId = req.params.userId;
  Cart.getCartByUser(userId, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const removeFromCart = (req, res) => {
  Cart.removeItem(req.params.cartId, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Item removed from cart' });
  });
};

// add near other controllers in controllers/cartController.js
const getCartCount = (req, res) => {
  const userId = req.params.userId;
  Cart.getCartCountByUser(userId, (err, results) => {
    if (err) return res.status(500).json(err);
    // results[0].count will be numeric (0 if no rows)
    const count = results && results[0] ? results[0].count : 0;
    res.json({ count });
  });
};

module.exports = { addToCart, getCart, removeFromCart, getCartCount };

