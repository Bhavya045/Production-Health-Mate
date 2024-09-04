const userModel = require("../models/userModel");
const mongoose = require('mongoose');
const appointmentModel = require('../models/appointmentModel')
const bcyrpt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const moment = require('moment');

const doctorModel =require('../models/doctorModel');
const registercontrollers=async(req,res)=>{
    try{
        const existinguser=await userModel.findOne({email:req.body.email})
        if(existinguser){
            return res.status(200).send({message:`User Already exists`,success:false})

        }
        const password=req.body.password
        const salt= await bcyrpt.genSalt(10)
        const hashedpassword= await bcyrpt.hash(password,salt)
        req.body.password=hashedpassword
        const newuser= new userModel(req.body)
        await newuser.save();
        res.status(201).send({message:`Registered Successfully`,success:true});
    }catch(error){
        console.log(error)
        res.status(500).send({success:false,message:`Register controllers${error.message}`})
    }

};



const logincontrollers= async(req,res)=>{
    try{
        const user =await userModel.findOne({email:req.body.email})
        if (!user) {
            return res.status(200).send({message:`user not found`,success:false})
        }
        const ismatch= await bcyrpt.compare(req.body.password,user.password)
        if (!ismatch) {
            return res.status(200).send({message:`Invalid Email or Password`,success:false})   
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
        res.status(200).send({message:`Login success `,success:true,token})

    }catch(error){
        console.log(error)
        res.status(500).send({message:`Error in login CTRL ${error.message}`})

    }
};
const authControllers = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).send({
                message: "User ID is required",
                success: false,
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).send({
                message: "User not found",
                success: false,
            });
        }

        user.password = undefined;

        res.status(200).send({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send({
            message: "Internal Server Error",
            success: false,
            error: error.message, // This gives more detail about the error
        });
    }
};


//apply doctor
const applyDoctorController=async(req,res) =>{
    try {
        const newDoctor =await doctorModel({...req.body, status:'pending'})
        await newDoctor.save()
        const adminUser = await userModel.findOne({isAdmin:true})
        const  notification = adminUser.notification
        notification.push({
            type:'apply-doctor-request',
            message:`${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
            data:{
                doctorId:newDoctor._id,
                name:newDoctor.firstName + " "+ newDoctor.lastName,
                onClickPath:'/admin/doctors'
            }
        });
        await userModel.findByIdAndUpdate(adminUser._id,{notification})
        res.status(201).send({
            success:true,
            message:'Doctor Applied Successfully'
        })
                   
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error While Applying For Doctor'
        })
    }
};

  //notification ctrl
const getAllNotificationController = async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.body.userId });
      const seennotification = user.seennotification;
      const notification = user.notification;
      seennotification.push(...notification);
      user.notification = [];
      user.seennotification = notification;
      const updatedUser = await user.save();
      res.status(200).send({
        success: true,
        message: "All Notification Marked As Read",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error in notification",
        success: false,
        error,
      });
    }
  };
  //delete notifications
  const deleteAllNotificationController = async(req,res) =>{
    try {
        const user = await userModel.findOne({_id:req.body.userId})
        user.notification =[]
        user.seennotification =[]
        const updatedUser = await user.save()
        updatedUser.password = undefined
        res.status(200).send({
            success:true,
            message:'Notification Deleted Successfully',
            data:updatedUser,
            
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Unable To Delete All Notifications',
            error
        })
        
    }
  }
  const getAllDoctorsController = async(req,res)=>{
    try {
        const doctors = await doctorModel.find({status:'approved'})
        res.status(200).send({
            success:true,
            message:'Doctors lists Fetched Successfully',
            data:doctors,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while fetching Doctor'
        })
    }
  }
//Book appointments
const bookAppointmentController = async (req, res) => {
    try {
        console.log('Booking request received:', req.body);

        const { doctorId, userId, date, time, ...rest } = req.body; // Destructure the required fields
        
        // Format date and time using moment
        const formattedDate = moment(date, 'DD-MM-YYYY').toISOString();
        const formattedTime = moment(time[0], 'HH:mm').toISOString(); // Assuming time is an array

        // Create the new appointment object with correct fields
        const newAppointment = new appointmentModel({
            doctor: doctorId,          
            patient: userId,           
            date: formattedDate,      
            time: formattedTime,      
            status: 'pending',
            ...rest                  
        });

        await newAppointment.save(); 

        // Send notification to the user
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        // Check if 'name' is available in rest
        const userName = rest.name || 'User'; // Default to 'User' if name is not provided

        user.notification.push({
            type: 'New-appointment-request',
            message: `A new Appointment Request from ${userName}`, // Use userName
            onClickPath: '/user/appointments'
        });

        await user.save(); // Save the updated user with the new notification

        res.status(200).send({
            success: true,
            message: 'Appointment Booked Successfully'
        });
    } catch (error) {
        console.error('Error while Booking Appointment:', error);
        res.status(500).send({
            success: false,
            message: 'Error while Booking Appointment',
            error: error.message
        });
    }
};

//bookingAvailabilityController
const bookingAvailabilityController =async(req,res) =>{
    try {
        const date = moment(req.body.date,'DD-MM-YYYY').toISOString()
        const fromTime = moment(req.body.time,'HH:mm').subtract(1,'hours').toISOString()
        const toTime = moment(req.body.time,'HH:mm').add(1,'hours').toISOString()
        const doctorId = req.body.doctorId
        const appointment = await appointmentModel.find({doctorId,
            date,
            time:{
                $gte:fromTime, $lte:toTime,
            }})
            if(appointment.length>0){
                return res.status(200).send({
                    message:'Appointments not Available at this time',
                    success:true
                })
            }
                else{
                    return res.status(200).send({
                        success:true,
                        message:'Appointment Available'
                    });
                }
            
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Booking'
        })
    }

}

// User Appointments Controller
const userAppointmentsController = async(req, res) => {
    try {
      const appointments = await appointmentModel.find({
        userId: req.body.userId,
      });
      res.status(200).send({
        success: true,
        message: "Users Appointments Fetch SUccessfully",
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error In User Appointments",
      });
    }
  };





module.exports={logincontrollers
    ,registercontrollers
    ,authControllers
    ,applyDoctorController,
    getAllNotificationController,
    getAllDoctorsController,
    deleteAllNotificationController,
    bookAppointmentController,
    bookingAvailabilityController,
    userAppointmentsController,
};

