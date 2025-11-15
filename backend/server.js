import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS only for your frontend
app.use(cors({
  origin: "https://your-frontend-url.vercel.app", // replace with your deployed frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Serve static images from public/images
app.use("/images", express.static(path.join(process.cwd(), "public/images")));

// Connect to MySQL
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

// ---------- PRODUCTS ----------
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ---------- USERS ----------
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Signup
app.post("/api/users/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length > 0) return res.status(400).json({ message: "Email already exists" });

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        const user = { id: result.insertId, name, email };
        res.status(201).json({ message: "User created", user, token: "dummy-token" });
      }
    );
  });
});

// Login
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      const user = results[0];
      res.json({ user, token: "dummy-token" });
    }
  );
});

// ---------- ORDERS ----------
app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ---------- CART ----------
app.get("/cart", (req, res) => {
  db.query("SELECT * FROM cart", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ---------- PAYMENTS ----------
app.get("/payments", (req, res) => {
  db.query("SELECT * FROM payments", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
