const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');


router.get('/movies', MovieController.getMovie);
router.post('/movies', MovieController.postMovie);
router.delete('/movies/:id');

module.exports = router;