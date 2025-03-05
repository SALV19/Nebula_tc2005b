const express = require("express")
const router = express.Router()

router.get("/", (request, response) => {
  response.send("login page")
})

module.exports = router;