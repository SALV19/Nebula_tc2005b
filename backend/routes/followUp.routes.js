const express = require('express')
const router = express.Router()

const follow_up_controller = require("../controller/follow_ups.controller");


router.get('/', follow_up_controller.get_requests);
router.post('/', follow_up_controller.post_follow_ups);

router.post('/Collaborators', follow_up_controller.get_followUps_info)


module.exports = router;