const express = require("express");
const router = express.Router();
const passport = require("passport");
const scope_def = require("../util/google_auth");

const log_in_routes = require("../controller/log_in.controller");
const other_controllers = require("../controller/other.controller");

router.get("/", log_in_routes.get_log_in);
router.post("/", log_in_routes.post_log_in);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: scope_def })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/log_in/success",
    failureRedirect: "/log_in/auth/failure",
  })
);
router.get("/auth/failure", log_in_routes.auth_fail);
router.get('/success', other_controllers.get_permissions)

const reset_password_routes = require("../controller/reset_password.controller");
const token_middleware=require("../util/token_middleware")
router.get("/forgot_password", reset_password_routes.get_reset_password_request);
router.post("/forgot_password", reset_password_routes.post_reset_password_request);

router.get("/token", reset_password_routes.get_token);
router.post("/token", reset_password_routes.post_token);

router.get("/reset_password",token_middleware.token_middleware, reset_password_routes.get_reset_password);
router.post("/reset_password", reset_password_routes.post_reset_password);

module.exports = router;
