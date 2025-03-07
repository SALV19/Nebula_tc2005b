const express = require("express")
const router = express.Router()

const log_in_routes = require("../controller/log_in.controller");

router.get("/", (request, response) => {
  response.send("login page")
})

module.exports = router;