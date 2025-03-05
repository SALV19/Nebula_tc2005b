const express = require("express")
const router = express.Router()

router.get("/", (request, response) => {
  response.send("Home");
});
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




module.exports = router;