const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const signup = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  User.create({ name, email, password: hashedPassword }, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'User created', userId: results.insertId });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.getByEmail(email, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

    res.json({ message: 'Login successful', userId: user.id });
  });
};

module.exports = { signup, login };
