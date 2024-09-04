const doctorModel = require("../models/doctorModel")
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");

const getDoctorInfoController = async(req,res)=>{
    try {
        const doctor = await doctorModel.findOne({userId:req.body.userId})
        res.status(200).send({
            success:true,
            message:'doctor data fetch success',
            data:doctor,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in fetching Doctor details'
        });
    }
};
const updateProfileController= async(req,res)=>{
    try {
        const doctor = await doctorModel.findOneAndUpdate({userId:req.body.userId},req.body)
        res .status(201).send({
            success:true,
            message:'Doctor Profile Updated',
            data:doctor,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Doctor Profile Update issue',
            error
        })
    }

};
//get single doctor
const getDoctorByIdController = async (req, res) => {
    try {
        const { doctorId } = req.body; // Ensure you are getting doctorId from the request body
        const doctor = await doctorModel.findById(doctorId); // Assuming you are using findById

        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor not found',
                data: null,
            });
        }

        res.status(200).send({
            success: true,
            message: 'Single Doctor Info Fetched',
            data: doctor,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching doctor info',
            error: error.message,
        });
    }
};
const doctorAppointmentsController =async(req,res)=> {
    try {
        const doctor = await doctorModel.findOne({userId:req.body.userId})
        const appointments = await appointmentModel.find({doctorId:req.body.doctorId})
        res.status(200).send({
            success:true,
            message:'Doctor Appointments fetch Successfully',
            data:appointments,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Doc Appointments'
        })
    }
}
const updateStatusController =async(req,res)=>{
try {
    const{appointmentsId,status} = req.body
    const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId,{status})
    const user = await userModel.findOne({ _id: appointments.userId });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
       const notification = user.notification
        
        const userName = rest.name || 'User'; 

        notification.push({
            type: 'Status Updated',
            message: `your appointment has been updated ${status}`, 
            onClickPath: '/doctor-appointments'
        });

        await user.save(); 
        res.status(200).send({
            success:true,
            message:'Appointment Status Updated',
        })
   
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        error,
        message:'Error in update Status'
    })
}
}





module.exports ={getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
doctorAppointmentsController,
updateStatusController};