const express = require('express')
const router = express.Router()

const personal_controller = require("../controller/personal_info.controller");

router.get("/", personal_controller.get_personal_info);

module.exports = router;