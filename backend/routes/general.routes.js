const express = require("express");
const router = express.Router();

const collabs_routes = require("../controller/collabs.controller");
const follow_ups_routes = require("../controller/follow_ups.controller");
const goals_routes = require("../controller/goals.controller");
const home_routes = require("../controller/home.controller");
const personal_info_routes = require("../controller/personal_info.controller");
const reports_routes = require("../controller/reports.controller");
const requests_routes = require("../controller/requests.controller");

const permission_middleware = require("../util/middlewares/permission.middleware");

router.get("/view_collabs", collabs_routes.get_collabs);
router.get("/follow_ups", follow_ups_routes.get_follow_ups);
router.get("/goals", goals_routes.get_goals);
router.get("/personal_info", personal_info_routes.get_personal_info);
router.get("/reports", reports_routes.get_reports);
router.get("/requests", requests_routes.get_requests);
router.get("/", home_routes.get_home);

module.exports = router;
