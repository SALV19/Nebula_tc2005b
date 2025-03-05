const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.send("Home")
})
router.get("/goals", (req, res) => {
  res.send("Goals")
})
router.get("/requests", (req, res) => {
  res.send("Requests")
})
router.get("/follow_ups", (req, res) => {
  res.send("Follow ups")
})
router.get("/personal_info", (req, res) => {
  res.send("Personal Info")
})



module.exports = router;