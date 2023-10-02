const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');


router.get('/movies', MovieController.getMovie);
router.post('/movies', MovieController.postMovie);
router.get('/movies/:id', MovieController.getMovieDetail)
router.delete('/movies/:id', MovieController.deleteMovie);

module.exports = router;