const express = require("express");
const router = express.Router();

const followUp_routes = require('./followUp.routes');
const home_routes = require("../controller/home.controller");
const personal_info_routes = require("../controller/personal_info.controller");
const reports_routes = require("../controller/reports.controller");
const request_routes = require('./request.routes')
const collabs_routes = require("./collabs.routes");

router.use("/view_collabs", collabs_routes);
router.use("/follow_ups", followUp_routes);
router.get("/personal_info", personal_info_routes.get_personal_info);
router.get("/reports", reports_routes.get_reports);
router.use("/requests", request_routes);
router.get("/", home_routes.get_home);

module.exports = router;
