const express = require("express");
const router = express.Router();

const other_controllers = require("../controller/other.controller");

router.get(other_controllers.get_404);


module.exports = router
