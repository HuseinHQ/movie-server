"use strict";
const bcryptjs = require("bcryptjs");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.hasMany(models.Movie, { foreignKey: "authorId" });
    }
  }
  Customer.init(
    {
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: { msg: "Email must be unique" },
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email is required",
          },
          notEmpty: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Type must be Email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
          notEmpty: {
            msg: "Password is required",
          },
          len: {
            args: [5, Infinity],
            msg: "Minimal length of password is 5",
          },
        },
      },
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate(customer) {
          const salt = bcryptjs.genSaltSync(8);
          const hash = bcryptjs.hashSync(customer.password, salt);
          customer.password = hash;
        },
      },
      sequelize,
      modelName: "Customer",
    }
  );
  return Customer;
};
