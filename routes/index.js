const express = require("express");
const router = express.Router();
const MovieController = require("../controllers/MovieController");
const GenreController = require("../controllers/GenreController");
const UserControlller = require("../controllers/UserController");
const HistoryController = require("../controllers/HistoryController");
const authentication = require("../middlewares/authentication");
const { changeMovie, setMovieStatus } = require("../middlewares/authorization");
const publicRoutes = require("./public");

// LOGIN WITH GOOGLE
router.post("/google-login", UserControlller.googleLogin);

// REGISTER AND LOGIN
router.post("/register", UserControlller.register);
router.post("/login", UserControlller.login);

// PUBLIC ROUTE
router.use("/pub", publicRoutes);

// AUTHENTICATION
router.use(authentication);

router.get("/users", UserControlller.getUser);
router.get("/movies", MovieController.getMovie);
router.post("/movies", MovieController.postMovie);
router.get("/movies/:id", MovieController.getMovieDetail);
router.put("/movies/:id", changeMovie, MovieController.putMovie);
router.patch("/movies/:id", setMovieStatus, MovieController.patchMovie);
router.delete("/movies/:id", changeMovie, MovieController.deleteMovie);
router.get("/genres", GenreController.getGenre);
router.get("/histories", HistoryController.getHistories);

module.exports = router;
