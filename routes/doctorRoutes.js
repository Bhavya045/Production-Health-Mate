const express =require('express')
const authMiddlewares =require("../middlewares/authMiddlewares")
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } = require('../controllers/doctorctrl')
const router = express.Router()

//post single doc Info
router.post('/getDoctorInfo',authMiddlewares,getDoctorInfoController);

router.post('/updateProfile',authMiddlewares,updateProfileController );

router.post('/getDoctorById',authMiddlewares,getDoctorByIdController);


router.get('/doctor-appointments',authMiddlewares,doctorAppointmentsController)

router.post('/update-status',authMiddlewares,updateStatusController)

module.exports = router