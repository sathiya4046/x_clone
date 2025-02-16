import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {v2 as cloudinary} from 'cloudinary'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import path from 'path'

import connectDB from './db/connectDB.js'

import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import notificationRoute from './routes/noticationRoute.js'


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({
  limit: "50mb" //default 100kb
}))
app.use(cors({
  // origin:"http://localhost:3000",
  origin:"https://x-clone-dnl2.onrender.com",
  credentials:true,
  methods:["POST","GET","PUT","DELETE"]
}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/auth',authRoute)
app.use('/api/users',userRoute)
app.use('/api/posts',postRoute)
app.use('/api/notifications',notificationRoute)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,'/frontend/build')))
  app.use("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
  })
}


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB()
});
