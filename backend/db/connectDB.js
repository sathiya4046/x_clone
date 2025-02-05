import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        .then(()=>console.log('Connected'))
    }catch(error){
        console.log(`Error in db ${error}`)
        process.exit(1)
    }
}


export default connectDB

