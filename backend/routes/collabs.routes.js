const express = require('express')
const router = express.Router()

const collabs_controller = require('../controller/collabs.controller')

router.get('/', collabs_controller.get_collabs);
router.post('/', collabs_controller.post_collab);

router.post('/Active', collabs_controller.get_collabs_info)
router.post('/Inactive', collabs_controller.get_inactive)
router.post('/get_collab_data', collabs_controller.get_collab_data);
router.post('/update_collab', collabs_controller.update_collab);
router.post('/uploadFA', collabs_controller.uploadFA)

module.exports = router;