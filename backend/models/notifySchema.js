import mongoose from "mongoose";

const notifySchema = new mongoose.Schema({
    from: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required: true 
    },
    to: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required: true 
    },
    type: { 
        type: String, 
        required: true,
        enum:["follow","like","comment"]
    },
    read: {
        type:Boolean,
        default:false
    }
    
},{timestamps: true});

const Notify = mongoose.model("Notification",notifySchema)

export default Notify