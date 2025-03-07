const express = require("express")
const router = express.Router()

const log_in_routes = require("../controller/log_in.controller");

router.get("/", log_in_routes.get_log_in);

router.post("/", log_in_routes.post_log_in);

module.exports = router;