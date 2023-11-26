const { Router } = require("express");
const { requireAuth } = require("../middleWares/middleware")
const { home_get, signin_get, signup_post, login_post, logout_get } = require("../controllers/controller")

router = Router();

router.get("/home", home_get)
router.get("/signin", signin_get);
router.post("/register", signup_post);
router.post("/login", login_post);
router.get("/logout", logout_get);

module.exports = router;