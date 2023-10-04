const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const GenreController = require('../controllers/GenreController');
const UserControlller = require('../controllers/UserController');
const authentication = require('../middlewares/authentication');
const { deleteMovie } = require('../middlewares/authorization');

// LOGIN WITH GOOGLE
router.post('/google-login', UserControlller.googleLogin)

// REGISTER AND LOGIN
router.post('/register', UserControlller.register)
router.post('/login', UserControlller.login)

// AUTHENTICATION
router.use(authentication);

router.get('/movies', MovieController.getMovie);
router.post('/movies', MovieController.postMovie);
router.get('/movies/:id', MovieController.getMovieDetail);
router.delete('/movies/:id', deleteMovie, MovieController.deleteMovie);
router.get('/genres', GenreController.getGenre)

module.exports = router;