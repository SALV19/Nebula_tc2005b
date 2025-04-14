const express = require("express");
const router = express.Router();

const home_routes = require("../controller/home.controller");
const permissions_middleware = require('../util/middlewares/permission.middleware')


router.get("/", home_routes.get_home);
router.post("/addEvent", permissions_middleware.general_permissions, home_routes.add_event);
router.post("/", home_routes.get_requests);

module.exports = router;
