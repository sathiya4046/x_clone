import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import express from 'express'

const app = express();
app.use(cookieParser())


const verifyUser = (req,res,next)=>{
  const token = req.cookies.token
  if(!token){
      res.status(500).json({error:"Permission needed"})
  }else{
      jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
          if(err){
              res.status(500).json({error:"Invalid Token"})
          }else{
              req.user = decoded
              next()
          }
      })
  }
}

export default verifyUser