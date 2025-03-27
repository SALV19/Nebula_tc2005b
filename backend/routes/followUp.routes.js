const express = require('express')
const router = express.Router()

const follow_up_controller = require("../controller/follow_ups.controller");

// router.get('/', follow_up_controller.get_collabs);
// router.get('/register', follow_up_controller.get_requests);
// router.post('/register', follow_up_controller.post_follow_ups);

// router.get('/meetings', follow_up_controller.get_meeting);
// router.post('/meetings', follow_up_controller.post_meeting);
router.post('/Register/save', follow_up_controller.post_follow_ups);
router.get('/Register', follow_up_controller.get_register);
router.get('/', follow_up_controller.get_FollowUp)


module.exports = router;