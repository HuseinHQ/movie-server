const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/CustomerControler");
const MovieController = require("../controllers/MovieController");

router.post("/register", CustomerController.register);
router.post("/login", CustomerController.login);
router.post("/google-login", CustomerController.googleLogin);
router.get("/movies", MovieController.getMovieWithPaginationAndFilter);

module.exports = router;
