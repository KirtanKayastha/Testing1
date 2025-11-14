// productModel.js
const db = require('../config/db');

const Product = {
  getAll: (callback) => db.query('SELECT * FROM products', callback),
  getById: (id, callback) => db.query('SELECT * FROM products WHERE id = ?', [id], callback),
  create: (product, callback) => {
    const { name, description, price, image, stock, rating } = product;
    db.query(
      'INSERT INTO products (name, description, price, image, stock, rating) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, image, stock, rating || 0],
      callback
    );
  },
  updateStock: (id, stock, callback) => db.query('UPDATE products SET stock = ? WHERE id = ?', [stock, id], callback),

  search: (keyword, callback) => {
    const searchTerm = `%${keyword}%`;
    db.query(
      'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
      [searchTerm, searchTerm],
      callback
    );
  }
};

module.exports = Product;
