const jwt = require('jsonwebtoken')
const { User } = require('../models/')

async function verifyToken(req, res, next) {
  try {
    const { access_token } = req.headers;
    const payload = verifyToken(access_token);

    const user = await User.findByPk(payload.id)
    if (!user) {
      throw { name: 'JsonWebTokenError' }
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    next();
  } catch (error) {
    next(error)
  }
}

module.exports = { verifyToken }