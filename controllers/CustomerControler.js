const { Customer } = require("../models/");
const bcryptjs = require("bcryptjs");
const { generateToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

class CustomerController {
  static async register(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;

      const newCustomer = await Customer.create({ username, email, password, phoneNumber, address });
      res.status(201).json({
        id: newCustomer.id,
        email: newCustomer.email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const findCustomer = await Customer.findOne({
        where: { email },
      });

      if (findCustomer) {
        const isPasswordValid = bcryptjs.compareSync(password, findCustomer.password);

        if (isPasswordValid) {
          const payload = {
            id: findCustomer.id,
            email: findCustomer.email,
          };

          const access_token = generateToken(payload);

          res.status(200).json({ access_token });
        } else {
          throw { name: "Invalid credentials" };
        }
      } else {
        throw { name: "Invalid credentials" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const client = new OAuth2Client();
      const { google_token } = req.headers;

      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const [customer, created] = await Customer.findOrCreate({
        where: { email: payload.email },
        defaults: {
          username: payload.name,
          email: payload.email,
          password: String(Math.random() * 5 + 1),
        },
        hooks: false,
      });

      const access_token = generateToken({ id: customer.id });

      if (created) {
        res.status(201).json({ access_token });
      } else {
        res.status(200).json({ access_token });
      }
    } catch (error) {
      next(error);
    }
  }

  static async generateQrCode(req, res, next) {
    try {
      const { QR_CODE_API_KEY } = process.env;
      const { url } = req.body;
      const generatedQrCode = await axios({
        method: "post",
        url: "https://api.qr-code-generator.com/v1/create?access-token=" + QR_CODE_API_KEY,
        data: {
          frame_name: "no-frame",
          qr_code_text: url,
          image_format: "SVG",
          qr_code_logo: "scan-me-square",
        },
      });

      res.status(201).json({ qrcode: generatedQrCode.data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = CustomerController;
