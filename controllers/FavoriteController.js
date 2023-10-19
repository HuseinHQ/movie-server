const { Favorite, Movie, Genre } = require("../models/");

class FavoriteController {
  static async getFavorites(req, res, next) {
    try {
      const { id } = req.customer;

      const favorites = await Favorite.findAll({
        include: {
          model: Movie,
          include: Genre,
        },
        where: { CustomerId: id },
      });
      console.log(favorites);
      res.status(200).json(favorites);
    } catch (error) {
      next(error);
    }
  }

  static async postFavorite(req, res, next) {
    try {
      const { id } = req.body;

      const findMovie = await Movie.findByPk(id);
      if (!findMovie) {
        throw { name: "not found" };
      }

      const newFavorite = await Favorite.create({ CustomerId: req.customer.id, MovieId: id });

      res.status(201).json(newFavorite);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FavoriteController;
