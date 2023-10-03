const { Movie } = require('../models/')

async function deleteMovie(req, res, next) {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      throw { name: 'not found' }
    }

    if (req.user.role !== 'admin') {
      if (movie.authorId !== req.user.id) {
        throw { name: 'forbidden' }
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { deleteMovie }