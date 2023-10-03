const { User } = require('../models/');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserControlller {
  static async register(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.create({
        email,
        password,
      })

      res.status(201).json({
        id: user.id,
        email: user.email,
      })
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        const error = err.errors.map(el => el.message)
        res.status(400).json({
          message: error
        })
      } else if (err.name === 'SequelizeUniqueConstraintError') {
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

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email }
      })

      if (user) {
        const isPasswordValid = bcryptjs.compareSync(password, user.password);

        if (isPasswordValid) {
          const payload = {
            id: user.id,
            email: user.email
          }
          const access_token = jwt.sign(payload, 'ThisIsMyAppSecretKey@463128');

          res.status(200).json({ access_token })
        } else {
          res.status(401).json({
            error: 'invalid username or email or password'
          })
        }
      } else {
        res.status(401).json({
          error: 'invalid username or email or password'
        })
      }
    } catch (err) {
      res.status(500).json({
        message: 'Internal Server Error'
      })
    }
  }
}

module.exports = UserControlller;