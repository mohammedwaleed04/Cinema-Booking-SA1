const { Router } = require("express");
const { requireAuth } = require("../middleWares/middleware")
const { home_get, signin_get, signup_post, login_post, logout_get, booking_get, booking_post, movie_post, movie_get, profile_get, profile_update, booking_delete, about_get, search_get } = require("../controllers/controller")

router = Router();

router.get("/home", home_get);
router.get("/about", about_get);
router.get("/search", search_get);
router.get("/signin", signin_get);
router.post("/register", signup_post);
router.post("/login", login_post);
router.get("/logout", logout_get);
router.get("/book/:id", requireAuth, booking_get);
router.post("/book/:id", booking_post);
router.delete("/delete/:id", booking_delete);
router.post("/movie/add", movie_post);
router.get("/movies", movie_get);
router.get("/profile", requireAuth, profile_get);
router.patch("/profile/update", profile_update);

module.exports = router;