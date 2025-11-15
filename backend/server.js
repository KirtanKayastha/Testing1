// server.js
import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

// =======================
// Configure CORS
// =======================
const allowedOrigins = [
  "https://testing1-git-main-kirtan-kayasthas-projects.vercel.app" // your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow requests with no origin
    if (!allowedOrigins.includes(origin)) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// =======================
// Connect to MySQL
// =======================
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.getConnection((err) => {
  if (err) console.error("DB connection error:", err);
  else console.log("Connected to Railway MySQL!");
});

// =======================
// Routes
// =======================

// Root
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Orders
app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Cart
app.get("/cart", (req, res) => {
  db.query("SELECT * FROM cart", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Payments
app.get("/payments", (req, res) => {
  db.query("SELECT * FROM payments", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// =======================
// Start server
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
