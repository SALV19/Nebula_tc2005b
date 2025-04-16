const express = require("express");
const router = express.Router();
const permissions_middleware = require('../util/middlewares/permission.middleware')


const home_routes = require("../controller/home.controller");
router.post('/metric', home_routes.get_metric);
router.post("/addEvent", permissions_middleware.general_permissions, home_routes.add_event);
router.get('/', home_routes.get_home);

module.exports = router;
