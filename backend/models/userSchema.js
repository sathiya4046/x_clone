import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    dob:{
        type: String, 
        required: true
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    profileImg : {
            type:String,
            default:""
    },
    coverImg : {
            type:String,
            default:""
    },
    bio : {
        type:String,
        default:""
    },
    link : {
        type:String,
        default:""
    },
    likedPosts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Post",
            default:[]
        }
    ]

},{timestamps: true});

const User = mongoose.model("User",UserSchema)

export default User