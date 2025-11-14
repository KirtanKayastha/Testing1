const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

const createOrder = (req, res) => {
  const {
    userId,
    cartId,       // cart row to remove
    productId,
    productName,
    quantity,
    totalPrice,
    deliveryInfo
  } = req.body;

  // 1️⃣ Create order
  Order.create(
    { userId, productId, productName, quantity, totalPrice, deliveryInfo },
    (err, results) => {
      if (err) return res.status(500).json(err);

      const orderId = results.insertId;

      // 2️⃣ Remove this item from cart
      Cart.removeItem(cartId, (err2) => {
        if (err2) return res.status(500).json(err2);

        res.json({ message: 'Order created and cart updated', orderId });
      });
    }
  );
};

const getOrders = (req, res) => {
  const userId = req.params.userId;
  Order.getOrdersByUser(userId, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

module.exports = { createOrder, getOrders };
