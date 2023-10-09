const bcryptjs = require("bcryptjs");
const { Movie, User, Genre } = require("../models/");

class MovieController {
  static async postMovie(req, res, next) {
    try {
      const { title, synopsis, trailerUrl, imgUrl, rating, genreId } = req.body;

      const newMovie = await Movie.create({ title, synopsis, trailerUrl, imgUrl, rating, genreId, authorId: req.user.id });
      res.status(201).json(newMovie);
    } catch (error) {
      next(error);
    }
  }

  static async getMovie(req, res, next) {
    try {
      const movies = await Movie.findAll({
        include: [User, Genre],
      });
      res.status(200).json(movies);
    } catch (error) {
      next(error);
    }
  }

  static async getMovieDetail(req, res, next) {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id);

      if (movie) {
        res.status(200).json(movie);
      } else {
        throw { name: "not found" };
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteMovie(req, res, next) {
    try {
      const { id } = req.params;
      const deletedMovie = await Movie.destroy({ where: { id } });

      if (deletedMovie) {
        res.status(200).json({ message: `Movie with id ${id} success to delete` });
      } else {
        throw { name: "not found" };
      }
    } catch (error) {
      next(error);
    }
  }

  static async putMovie(req, res, next) {
    try {
      const { id } = req.params;
      const { title, synopsis, trailerUrl, imgUrl, rating, genreId } = req.body;

      // CARI APAKAH MOVIE DENGAN ID TERSEBUT ADA
      // const findMovie = await Movie.findByPk(id);
      // if (!findMovie) {
      //   throw { name: "not found" };
      // }

      const updatedMovie = await Movie.update(
        {
          title,
          synopsis,
          trailerUrl,
          imgUrl,
          rating,
          genreId,
          authorId: req.user.id,
        },
        { where: { id } }
      );

      if (updatedMovie[0] === 0) {
        throw { name: "not found" };
      }

      res.status(201).json({ message: `Movie with id ${id} updated` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MovieController;
