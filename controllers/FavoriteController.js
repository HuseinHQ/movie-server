const { Favorite, Movie } = require("../models/");

class FavoriteController {
  static async getFavorites(req, res, next) {
    try {
      const { id } = req.customer;

      const favorites = await Favorite.findAll({
        include: Movie,
        where: { CustomerId: id },
      });
      console.log(favorites);
      res.status(200).json(favorites);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FavoriteController;
