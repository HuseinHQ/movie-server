const { User } = require('../models/');
const bcryptjs = require('bcryptjs');
const { generateToken } = require('../helpers/jwt');
const { OAuth2Client } = require('google-auth-library');

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

  static async googleLogin(req, res, next) {
    try {
      const client = new OAuth2Client();
      const { google_token } = req.headers

      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      const [user, created] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          username: payload.name,
          email: payload.email,
          password: String((Math.random() * 5) + 1),
          role: 'staff'
        },
        hooks: false
      })

      const access_token = generateToken({ id: user.id })

      if (created) {
        res.status(201).json({ access_token });
      } else {
        res.status(200).json({ access_token });
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserControlller;