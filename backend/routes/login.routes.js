const express = require("express");
const router = express.Router();
const passport = require("passport");

const log_in_routes = require("../controller/log_in.controller");

router.get("/", log_in_routes.get_log_in);
router.post("/", log_in_routes.post_log_in);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/log_in/auth/failure",
  })
);
router.get("/auth/failure", log_in_routes.auth_fail);

module.exports = router;
