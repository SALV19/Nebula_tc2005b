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

const reset_password_routes = require("../controller/reset_password.controller");
const token_middleware=require("../util/token_middleware")
router.get("/forgot_password", reset_password_routes.get_reset_password_request);
router.post("/forgot_password", reset_password_routes.post_reset_password_request);

router.get("/token", reset_password_routes.get_token);
router.post("/token", reset_password_routes.post_token);

router.get("/reset_password",token_middleware.token_middleware, reset_password_routes.get_reset_password);
router.post("/reset_password", reset_password_routes.post_reset_password);

module.exports = router;
