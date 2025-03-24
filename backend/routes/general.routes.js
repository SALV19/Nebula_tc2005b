const express = require("express");
const router = express.Router();

const collabs_routes = require("./collabs.routes");
const follow_ups_routes = require("../controller/follow_ups.controller");
const goals_routes = require("../controller/goals.controller");
const home_routes = require("./home.routes");
const personal_info_routes = require("../controller/personal_info.controller");
const reports_routes = require("../controller/reports.controller");
const request_routes = require('./request.routes')

router.use("/view_collabs", collabs_routes);
router.get("/follow_ups", follow_ups_routes.get_follow_ups);
router.get("/goals", goals_routes.get_goals);
router.get("/personal_info", personal_info_routes.get_personal_info);
router.get("/reports", reports_routes.get_reports);
router.use("/requests", request_routes);
router.get("/", home_routes);

module.exports = router;
