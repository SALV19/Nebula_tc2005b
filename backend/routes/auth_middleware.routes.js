const express = require("express");
const router = express.Router();

const auth_middleware = require("../controller/auth_middleware.controller");

router.get("/", auth_middleware.auth_user);

module.exports = router;
