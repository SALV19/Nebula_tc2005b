const express = require('express')
const router = express.Router()

const follow_up_controller = require("../controller/follow_ups.controller");


router.get('/meeting', follow_up_controller.get_meeting);
router.post('/meeting', follow_up_controller.post_meeting);
router.get('/meeting/events', follow_up_controller.get_meeting_events);
router.post('/Register/save', follow_up_controller.post_follow_ups);
router.get('/Register', follow_up_controller.get_register);
router.get('/Collaborators', follow_up_controller.get_followUps_info)
router.get('/', follow_up_controller.get_FollowUp)

module.exports = router;