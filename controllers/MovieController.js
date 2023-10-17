const bcryptjs = require("bcryptjs");
const { Movie, User, Genre, History } = require("../models/");

class MovieController {
  static async postMovie(req, res, next) {
    try {
      const { title, synopsis, trailerUrl, imgUrl, rating, genreId } = req.body;

      const newMovie = await Movie.create({ title, synopsis, trailerUrl, imgUrl, rating, genreId, authorId: req.user.id });

      await History.create({
        title,
        description: `POST : new movie with id ${newMovie.id} created`,
        updatedBy: req.user.email,
      });
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

      const findMovie = await Movie.findByPk(id);
      if (!findMovie) {
        throw { name: "not found" };
      }

      await Movie.update(
        {
          title,
          synopsis,
          trailerUrl,
          imgUrl,
          rating,
          genreId,
        },
        { where: { id } }
      );

      await History.create({
        title: title,
        description: `PUT: movie with id ${id} updated`,
        updatedBy: req.user.email,
      });
      res.status(200).json({ message: `Movie with id ${id} updated` });
    } catch (error) {
      next(error);
    }
  }

  static async patchMovie(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // CEK APAKAH STATUS YANG DIBERIKAN VALID
      const isStatusValid = ["Active", "Inactive", "Archived"].includes(status) ? true : false;
      console.log(isStatusValid);
      if (!isStatusValid) {
        throw { name: "invalid_status" };
      }

      const findMovie = await Movie.findByPk(id);
      if (!findMovie) {
        throw { name: "not found" };
      }

      if (findMovie.status === status) {
        throw { name: "same status", status };
      }

      await Movie.update({ status }, { where: { id } });

      await History.create({
        title: findMovie.title,
        description: `PATCH: Movie status with id ${id} has been updated from ${findMovie.status} into ${status}`,
        updatedBy: req.user.email,
      });
      res.status(200).json({ message: `Movie with id ${id} set to ${status}` });
    } catch (error) {
      next(error);
    }
  }

  static async getMovieWithPaginationAndFilter(req, res, next) {
    try {
      const { page = 1, size = 8, filter } = req.query;
      const option = {
        offset: page == 1 ? 0 : page * size,
        limit: size,
      };

      if (filter) {
        option.where = { genreId: filter };
      }

      const movies = await Movie.findAll({
        include: [User, Genre],
        ...option,
      });
      res.status(200).json(movies);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MovieController;
