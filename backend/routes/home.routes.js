const express = require("express");
const router = express.Router();

const home_routes = require("../controller/home.controller");

router.get('/', home_routes.get_calendar);

module.exports = router;
