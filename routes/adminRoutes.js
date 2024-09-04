const express = require('express')
const authMiddlewares = require('../middlewares/authMiddlewares');

const { getAllUsersController,
     getAllDoctorsController,
changeAccountStatusController, } = require('../controllers/adminctrls');




const router = express.Router()

router.get('/getAllUsers',authMiddlewares,getAllUsersController)

router.get('/getAllDoctors',authMiddlewares,getAllDoctorsController)
//POST Account status
router.post('/changeAccountStatus',authMiddlewares , changeAccountStatusController);




module.exports=router