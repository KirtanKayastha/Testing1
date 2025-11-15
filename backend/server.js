// server.js
import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());

// Allowed origins (update if Vercel redeploy changes)
const allowedOrigins = [
  "https://testing1-a8r06d0ii-kirtan-kayasthas-projects.vercel.app",
  "https://testing1-git-main-kirtan-kayasthas-projects.vercel.app",
  "https://testing1-3n4b7td9j-kirtan-kayasthas-projects.vercel.app",
  "https://testing1-ps1joh9if-kirtan-kayasthas-projects.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or curl requests
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy does not allow access from the specified origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Connect to MySQL (Railway or Render DB)
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.getConnection((err) => {
  if (err) console.error("DB connection error:", err);
  else console.log("Connected to MySQL!");
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ===== SIGNUP ROUTE =====
app.post("/api/users/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length > 0) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        const user = { id: result.insertId, name, email };
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ user, token });
      }
    );
  });
});

// ===== LOGIN ROUTE =====
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  });
});

// ===== PRODUCTS ROUTES =====
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Other GET routes: users, orders, cart, payments
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/cart", (req, res) => {
  db.query("SELECT * FROM cart", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/payments", (req, res) => {
  db.query("SELECT * FROM payments", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
