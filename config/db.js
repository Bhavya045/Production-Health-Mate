const mongoose = require('mongoose')
const colors = require('colors')

const connectdb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb Connected${mongoose.connection.host}`.bgCyan.white);

    }catch(error){
        console.log(`Mongodb Server Issue ${error}`.bgRed.white)

    }

};
module.exports=connectdb;
