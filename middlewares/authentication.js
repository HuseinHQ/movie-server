const { User, Customer } = require("../models/");
const { verifyToken } = require("../helpers/jwt");

async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;
    const payload = verifyToken(access_token);

    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: "JsonWebTokenError" };
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

async function publicAuthentication(req, res, next) {
  try {
    const { access_token } = req.headers;

    const payload = verifyToken(access_token);

    const customer = await Customer.findByPk(payload.id);
    if (!customer) {
      throw { name: "JsonWebTokenError" };
    }

    req.customer = {
      id: customer.id,
      email: customer.email,
      role: "customer",
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authentication, publicAuthentication };
