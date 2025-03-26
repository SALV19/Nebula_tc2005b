const express = require('express')
const router = express.Router()

const collabs_controller = require('../controller/collabs.controller')

router.get('/', collabs_controller.get_collabs);
router.post('/', collabs_controller.post_collab);

router.post('/Active', collabs_controller.get_collabs_info)

module.exports = router;