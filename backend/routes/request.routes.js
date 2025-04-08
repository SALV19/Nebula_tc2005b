const express = require('express')
const router = express.Router()

const request_controller = require('../controller/requests.controller')

router.get('/', request_controller.get_requests);
router.post('/Requests', request_controller.get_collabs_requests);
router.post('/Abscences', request_controller.get_abscences);
router.post('/Vacations', request_controller.get_vacations);
router.get('/pop_up', request_controller.showPopUp)
router.post('/insert_request', request_controller.post_abscence_requests)
router.post('/Requests/update', request_controller.update_estado);
router.post('/update_request', request_controller.update_request)

router.post('/', request_controller.update_estado);



module.exports = router;