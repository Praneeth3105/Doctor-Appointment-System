const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentController, updateStatusController } = require('../controllers/doctorCtrl')
const { route } = require('./userRoutes')
const router=express.Router()
//POST SINGLE DOC INFO

router.post('/getDoctorInfo',authMiddleware,getDoctorInfoController)

//POST UPDATE PROFILE
router.post('/updateProfile',authMiddleware,updateProfileController)

//POST GET SINGLE DOC INFO
router.post('/getDoctorById',authMiddleware,getDoctorByIdController)

//GET APPOINTMENTS
router.get('/doctor-appointments',authMiddleware,doctorAppointmentController)

//POST UPDATE STATUS

router.post('/update-status',authMiddleware,updateStatusController);

module.exports=router