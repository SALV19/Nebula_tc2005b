const express = require('express')
const router = express.Router()

const follow_up_routes = require("../controller/follow_ups.controller");

router.get('/', follow_up_routes.get_requests);
// router.get('/', )


module.exports = router;