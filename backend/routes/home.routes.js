const express = require('express')
const router = express.Router()

const home_controller = require('../controller/home.controller')
const cont_vacations = require("../controller/contVacations.controller");


router.get('/vacationDays', cont_vacations.get_vacationsLeft)
router.get('/', home_controller.get_home); 

module.exports = router;