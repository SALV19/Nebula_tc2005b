const express = require('express')
const router = express.Router()

const request_controller = require('../controller/requests.controller')

router.get('/', request_controller.get_requests);
router.post('/Requests', request_controller.get_collabs_requests);
router.get('/Abscences', request_controller.get_abscences);
router.get('/Vacations', request_controller.get_vacations);
<<<<<<< HEAD
router.post('/insert_request', request_controller.post_abscence_requests)
=======
>>>>>>> fa/REQ_29_superadmin_registers_collaborators

module.exports = router;