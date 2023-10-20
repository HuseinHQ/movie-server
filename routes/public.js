const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/CustomerControler");
const MovieController = require("../controllers/MovieController");
const FavoriteController = require("../controllers/FavoriteController");
const { publicAuthentication } = require("../middlewares/authentication");
const { getFavorite } = require("../middlewares/authorization");
const GenreController = require("../controllers/GenreController");

router.post("/register", CustomerController.register);
router.post("/login", CustomerController.login);
router.post("/google-login", CustomerController.googleLogin);
router.get("/movies", MovieController.getMovieWithPaginationAndFilter);
router.get("/movies/:id", MovieController.getMovieDetail);
router.get("/genres", GenreController.getGenre);
router.post("/qr-code", CustomerController.generateQrCode);

router.use(publicAuthentication);
router.get("/favorites", getFavorite, FavoriteController.getFavorites);
router.post("/favorites", FavoriteController.postFavorite);

module.exports = router;
