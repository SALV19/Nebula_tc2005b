const express = require("express");
const router = express.Router();

const followUp_routes = require('./followUp.routes');
const home_routes = require("../controller/home.controller");
const personal_info_routes = require("../controller/personal_info.controller");
const reports_routes = require("../controller/reports.controller");
const request_routes = require('./request.routes')
const collabs_routes = require("./collabs.routes");

const permissions_middleware = require('../util/middlewares/permission.middleware')

router.use("/view_collabs", permissions_middleware.view_collabs, collabs_routes);
router.use("/follow_ups", permissions_middleware.general_permissions, followUp_routes);
router.get("/personal_info", permissions_middleware.general_permissions, personal_info_routes.get_personal_info);
router.get("/reports", permissions_middleware.view_reports, reports_routes.get_reports);
router.use("/requests", permissions_middleware.general_permissions, request_routes);
router.get("/", home_routes.get_home);
router.post("/addEvent", permissions_middleware.general_permissions, home_routes.add_event);
router.post("/deleteEvent", permissions_middleware.general_permissions, home_routes.delete_event);


module.exports = router;
