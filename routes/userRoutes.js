const express=require('express');

const { logincontrollers,
     registercontrollers,
      authControllers,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDoctorsController,
    bookAppointmentController,
    bookingAvailabilityController,
    userAppointmentsController, } = require('../controllers/userctrls');
    const authMiddlewares = require("../middlewares/authMiddlewares");



const router=express.Router();

router.post("/login",logincontrollers);

router.post('/GetUserdata',authMiddlewares,authControllers)


//apply doctor||post
router.post('/apply-doctor',authMiddlewares,applyDoctorController);

//Notification Doctor || POST
router.post('/get-all-notification',authMiddlewares, getAllNotificationController);

//Notification Doctor || POST
router.post('/delete-all-notification',authMiddlewares, deleteAllNotificationController);

//Get all doc
router.get('/getAllDoctors',authMiddlewares,getAllDoctorsController);

//Book appointment
router.post('/book-appointment',authMiddlewares,bookAppointmentController);
//Booking Availability
router.post('/booking-availability',authMiddlewares,bookingAvailabilityController)

//Appointments List 
router.get('/user-appointments',authMiddlewares,userAppointmentsController)


router.post("/register",registercontrollers);
module.exports=router;
