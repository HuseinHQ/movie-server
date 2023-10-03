const { User } = require('../models/');
const bcryptjs = require('bcryptjs');
const { generateToken } = require('../helpers/jwt');

class UserControlller {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.create({
        email,
        password,
        role: 'admin'
      })

      res.status(201).json({
        id: user.id,
        email: user.email,
      })
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
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

          const access_token = generateToken(payload);

          res.status(200).json({ access_token })
        } else {
          throw { name: 'Invalid credentials' }
        }
      } else {
        throw { name: 'Invalid credentials' }
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserControlller;