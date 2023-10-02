const bcryptjs = require('bcryptjs');
const { Movie } = require('../models/')

class MovieController {
  static async postMovie(req, res) {
    try {
      const { title, synopsis, trailerUrl, imgUrl, rating, genreId, authorId } = req.body;

      const newMovie = await Movie.create({ title, synopsis, trailerUrl, imgUrl, rating, genreId, authorId });
      res.status(201).json(newMovie);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const err = error.errors.map(el => el.message)
        res.status(400).json({ message: err });
      } else {
        res.status(500).json({ message: 'Internal Server Error' })
      }
    }
  }

  static async getMovie(req, res) {
    try {
      const movies = await Movie.findAll();
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  static async getMovieDetail(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id)

      if (movie) {
        res.status(200).json(movie)
      } else {
        res.status(404).json({ message: 'error not found' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  static async deleteMovie(req, res) {
    try {
      const { id } = req.params
      const deletedMovie = await Movie.destroy({ where: { id } });

      res.status(200)
    } catch (error) {

    }
  }
}

module.exports = MovieController;