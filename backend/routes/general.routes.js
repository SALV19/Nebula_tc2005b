const express = require("express");
const router = express.Router();

const general_routes = require("../controller/general.controller");

router.get("/", general_routes.get_home);
router.get("/goals", (request, response) => {
  response.send("Goals");
});
router.get("/requests", (request, response) => {
  response.send("Requests");
});
router.get("/follow_ups", (request, response) => {
  response.send("Follow ups");
});
router.get("/personal_info", (request, response) => {
  response.send("Personal Info");
});
router.get("/reports", (request, response) => {
  response.send("Reports");
});
router.get("/view_collabs", (request, response) => {
  response.send("View Collabs");
});

module.exports = router;
