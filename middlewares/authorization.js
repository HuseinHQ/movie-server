const { Movie } = require("../models/");

async function changeMovie(req, res, next) {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      throw { name: "not found" };
    }

    if (req.user.role !== "admin") {
      if (movie.authorId !== req.user.id) {
        throw { name: "forbidden" };
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function setMovieStatus(req, res, next) {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      throw { name: "not found" };
    }

    if (req.user.role !== "admin") {
      throw { name: "forbidden" };
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function getFavorite(req, res, next) {
  try {
    const { role } = req.customer;
    if (role !== "customer") {
      throw { name: "forbidden" };
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { changeMovie, setMovieStatus, getFavorite };
