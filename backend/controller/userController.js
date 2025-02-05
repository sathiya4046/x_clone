import User from "../models/userSchema.js"
import Notify from "../models/notifySchema.js"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import Post from "../models/postSchema.js"

export const getProfile = async (req,res)=>{
    const {username} = req.params
    try{
      const user = await User.findOne({username}).select("-password")
      if(!user){
        return res.status(404).json({error:"Username not available"})
      }
      const userId = user._id
      const getCount = await Post.countDocuments({user:userId})
      res.status(200).json({user,getCount})
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Username error"})
    }
}

export const followUnfollowuser = async (req,res)=>{
    const {id} = req.params
    try{
      const usertoModify = await User.findById({_id:id})
      const currentUser = await User.findById({_id:req.user.id})
  
      if(id===req.user.id){
        return res.status(400).json({error:"You can't follow/unfollow"})
      }
      if(!usertoModify || !currentUser){
        return res.status(404).json({error:"User not found"})
      }
      const isFollowing = currentUser.following.includes(id)
  
      if(isFollowing){
        //unfollow
        await User.findByIdAndUpdate({_id:id},{$pull:{followers:req.user.id}})
        await User.findByIdAndUpdate({_id:req.user.id},{$pull:{following:id}})
        res.status(200).json({message:"Unfollow successfully"})
      }else{
        //follow
        await User.findByIdAndUpdate({_id:id},{$push:{followers:req.user.id}})
        await User.findByIdAndUpdate({_id:req.user.id},{$push:{following:id}})
        await Notify.create({
          type:"follow",
          from:req.user.id,
          to:id,
        })
        res.status(200).json({message:"Follow successfully"})
      }
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Follow error"})
    }
}


export const getSuggestUser = async (req,res)=>{

    try{
      const currentUser = await User.findById({_id:req.user.id}).select("-password")
      const users = await User.aggregate([
        {
          $match : {
            _id: { $ne : req.user.id }
          }
        },{
          $sample : {
            size:10
          }
        }
      ])
  
      const filterUser = users.filter((user)=>!currentUser.following.includes(user._id))
      const suggestUser = filterUser.slice(0,4);
      
      suggestUser.forEach((user)=>(user.password = null))
  
      res.status(200).json(suggestUser)
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Suggestion error"})
    }
}

export const getFollowers = async (req,res)=>{
  const userId = req.user.id
  try{
    const currentUser = await User.findById({_id:userId}).select("followers").populate({
      path:"followers",
      select:"-password"
    }) 
    res.status(200).json(currentUser)
  }catch(error){
    console.error(error)
    return res.status(500).json({error:"Followers error"})
  }
}

export const getFollowing = async (req,res)=>{
  const userId = req.user.id
  try{
    const currentUser = await User.findById({_id:userId}).select("following").populate({
      path:"following",
      select:"-password"
    }) 
    res.status(200).json(currentUser)
  }catch(error){
    console.error(error)
    return res.status(500).json({error:"Following error"})
  }
}

export const updateUser = async(req,res)=>{
    const id = req.user.id
    const {name,password,bio,link,dob} = req.body
    let { profileImg, coverImg } =req.body
    try{
      let user = await User.findById({_id:id}).select("-password")
      if(!user){
        return res.status(404).json({error:"User not found"})
      }
  
      user.password = await bcrypt.hash(password.toString(),10)
  
      if(profileImg){
        if(user.profileImg){
          await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
        }
        const uploadResponse = await cloudinary.uploader.upload(profileImg)
        profileImg = uploadResponse.secure_url
      }
      if(coverImg){
        if(user.coverImg){
          await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
        }
        const uploadResponse = await cloudinary.uploader.upload(coverImg)
        coverImg = uploadResponse.secure_url
      }
      user.name = name || user.name
      user.dob = dob || user.dob
      user.bio = bio || user.bio
      user.link = link || user.link
      user.profileImg = profileImg || user.profileImg
      user.coverImg = coverImg || user.coverImg
  
      user = await user.save()
  
      user.password = null
  
      res.status(200).json(user)
  
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Update error"})
    }
}