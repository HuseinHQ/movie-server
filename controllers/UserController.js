const { User } = require('../models/');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserControlller {
  static async register(req, res) {
    try {
      const { email, password } = req.body;
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = bcryptjs.hashSync(password, salt);

      const user = await User.create({
        email,
        password: hashedPassword,
        role: 'admin'
      })

      res.status(201).json({
        id: user.id,
        email: user.email,
      })
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          message: 'Email already exists'
        })
      } else {
        res.status(500).json({
          message: 'Internal Server Error'
        })
      }
    }
  }
}

module.exports = UserControlller;