const express = require('express')
const router = express.Router()

const request_controller = require('../controller/requests.controller')

router.get('/', request_controller.get_requests);
router.get('/Requests', request_controller.get_collabs_requests);
router.get('/Abscences', request_controller.get_abscences);
router.get('/Vacations', request_controller.get_vacations);

module.exports = router;