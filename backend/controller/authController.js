import User from "../models/userSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

import cookieParser from 'cookie-parser'
import express from 'express'

const app = express()
app.use(cookieParser())

export const signUp = async (req,res)=>{
    const { name,email,username,password,dob } = req.body

  try{
    const extEmail = await User.findOne({email})
    const extUsername = await User.findOne({username})
    if(extEmail || extUsername){
      return res.status(400).json({error:"Email already exists"})
    }else{
      const hashPassword = await bcrypt.hash(password.toString(),10)

      const newUser = await User.create({
        name:name,
        email:email,
        username:username,
        password:hashPassword,
        dob:dob
      })
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '10d'});
      res.cookie("token", token, {
        maxAge:10*24*60*1000,
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", 
        sameSite:"strict"
      })
      res.status(200).json({message: "success"})
    }
  }catch(error){
    console.error(error)
    return res.status(500).json({error:"Server error"})
  }
}

export const signIn = async (req,res)=>{
    const { email,password } = req.body

    try{
      const checkEmail = await User.findOne({email})
      if(checkEmail){
        const comparePassword = await bcrypt.compare(password,checkEmail.password)
        const token = jwt.sign({ id: checkEmail._id }, process.env.JWT_SECRET, { expiresIn: '10d'});
        res.cookie("token", token, {
          maxAge:10*24*60*1000,
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development", 
          sameSite:"strict"
        })
        res.status(200).json({message:"success"})
      }else{
        return res.status(500).json({error:"Password mismatch"})
      }
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Email doesn't exists"})
    }
}

export const logout = (req,res)=>{
    try{
        res.clearCookie('token')
        res.status(200).json({message:"success"})
      }catch(error){
        console.error(error)
        return res.status(500).json({error:"Server error"})
      }
}


export const getMe = async(req,res)=>{
  try{
    const user = await User.findOne({_id:req.user.id}).select("-password")
    res.status(200).json(user)
  }catch(error){
    console.error(error)
    return res.status(500).json({error:"Server error"})
  }
}