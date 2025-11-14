const db = require('../config/db');

const User = {
  create: (user, callback) => {
    const { name, email, password, role } = user;
    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'customer'],
      callback
    );
  },

  getByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], callback);
  }
};

module.exports = User;
