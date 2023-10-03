const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const GenreController = require('../controllers/GenreController');
const UserControlller = require('../controllers/UserController');

// REGISTER
router.post('/register', UserControlller.register)
//LOGIN
router.post('/login')

router.get('/movies', MovieController.getMovie);
router.post('/movies', MovieController.postMovie);
router.get('/movies/:id', MovieController.getMovieDetail);
router.delete('/movies/:id', MovieController.deleteMovie);
router.get('/genres', GenreController.getGenre)

module.exports = router;