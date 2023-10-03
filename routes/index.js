const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const GenreController = require('../controllers/GenreController');
const UserControlller = require('../controllers/UserController');
const { verifyToken } = require('../middlewares/authentication');

// REGISTER AND LOGIN
router.post('/register', UserControlller.register)
router.post('/login', UserControlller.login)

// AUTHENTICATION
router.use(verifyToken);

router.get('/movies', MovieController.getMovie);
router.post('/movies', MovieController.postMovie);
router.get('/movies/:id', MovieController.getMovieDetail);
router.delete('/movies/:id', MovieController.deleteMovie);
router.get('/genres', GenreController.getGenre)

module.exports = router;