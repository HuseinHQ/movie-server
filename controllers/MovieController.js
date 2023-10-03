const bcryptjs = require('bcryptjs');
const { Movie } = require('../models/')

class MovieController {
  static async postMovie(req, res, next) {
    try {
      const { title, synopsis, trailerUrl, imgUrl, rating, genreId, authorId } = req.body;

      const newMovie = await Movie.create({ title, synopsis, trailerUrl, imgUrl, rating, genreId, authorId });
      res.status(201).json(newMovie);
    } catch (error) {
      next(error)
    }
  }

  static async getMovie(req, res, next) {
    try {
      const movies = await Movie.findAll();
      res.status(200).json(movies);
    } catch (error) {
      next(error)
    }
  }

  static async getMovieDetail(req, res, next) {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id)

      if (movie) {
        res.status(200).json(movie)
      } else {
        throw { name: 'not found' }
      }
    } catch (error) {
      next(error)
    }
  }

  static async deleteMovie(req, res, next) {
    try {
      const { id } = req.params
      const deletedMovie = await Movie.destroy({ where: { id } });

      if (deletedMovie) {
        res.status(200).json({ message: 'Movies success to delete' });
      } else {
        throw { name: 'not found' }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = MovieController;