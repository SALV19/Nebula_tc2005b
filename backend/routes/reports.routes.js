const express = require("express")
const router = express.Router()

const reports_routes = require("../controller/reports.controller");

router.get("/", reports_routes.get_reports);
router.post("/", reports_routes.get_general_report);
router.post("/selected_collabs", reports_routes.get_collabs)

module.exports = router