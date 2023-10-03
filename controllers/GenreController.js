const { Genre } = require('../models/')

class GenreController {
  static async getGenre(req, res, next) {
    try {
      const genres = await Genre.findAll();
      res.status(200).json(genres);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GenreController;