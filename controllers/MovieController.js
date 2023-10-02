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
}

module.exports = MovieController;