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

      const [newFavorite, isCreated] = await Favorite.findOrCreate({
        where: { CustomerId: req.customer.id, MovieId: id },
        defaults: {
          CustomerId: req.customer.id,
          MovieId: id,
        },
      });

      if (isCreated) {
        res.status(201).json({ newFavorite, isCreated });
      } else {
        res.status(200).json({ newFavorite, isCreated });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FavoriteController;
