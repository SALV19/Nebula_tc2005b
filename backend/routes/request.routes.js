const express = require('express')
const router = express.Router()

const request_controller = require('../controller/requests.controller')

router.get('/', request_controller.get_requests);
router.post('/Requests', request_controller.get_collabs_requests);
router.get('/Abscences', request_controller.get_abscences);
router.get('/Vacations', request_controller.get_vacations);
router.post('/', request_controller.update_estado);
router.post('/insert_request', request_controller.post_abscence_requests)

module.exports = router;