import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to Railway MySQL
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.getConnection((err) => {
  if(err) console.error("DB connection error:", err);
  else console.log("Connected to Railway MySQL!");
});

// Example route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
