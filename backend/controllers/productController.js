
const Product = require('../models/productModel');

const getAllProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const getProductById = (req, res) => {
  Product.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};
const searchProducts = (req, res) => {
  const { q } = req.query; // get search keyword
  if (!q) return res.status(400).json({ error: "Query is required" });

  Product.search(q, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

module.exports = { getAllProducts, getProductById, searchProducts };



