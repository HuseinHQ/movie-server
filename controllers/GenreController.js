const { Genre } = require('../models/')

class GenreController {
  static async getGenre(req, res) {
    try {
      const genres = await Genre.findAll();
      res.status(200).json(genres);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

module.exports = GenreController;