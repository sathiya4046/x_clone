import Notify from "../models/notifySchema.js"
import Post from "../models/postSchema.js"
import User from "../models/userSchema.js"
import {v2 as cloudinary} from 'cloudinary'

export const createPost = async (req,res)=>{

    const {text} = req.body
    let img = req.body.img
    const id = req.user.id
    const resourceType = req.body.resource_type
    try{
      const user = await User.findOne({_id:id})
      if(!user){
        return res.status(404).json({error:"User not found"})
      }
      if(!text && !img){
        return res.status(400).json({error:"Post must have text or image"})
      }
      if(img){
        const uploadResponse = await cloudinary.uploader.upload(img,{
          resource_type:resourceType
        })
        img = uploadResponse.secure_url
      }
  
      const newPost = await Post({
        user: id,
        text,
        img,
        resourceType
      })
  
      await newPost.save()
      res.status(201).json(newPost)
  
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Create post error"})
    }
}

export const likeUnlikepost = async (req,res)=>{
    const id = req.params.id
    const userId = req.user.id
    try{
      const post = await Post.findOne({_id:id})
      if(!post){
        return res.status(404).json({error:"post not found"})
      }
  
      const like = post.likes.includes(userId)
  
      if(like){
        await Post.updateOne({_id:id},{$pull : {likes:userId}})
        await User.updateOne({_id:userId},{$pull : {likedPosts:id}})

        const updateLikes = post.likes.filter((id)=>id.toString() !== userId.toString())
        res.status(200).json(updateLikes)
      }else{
        post.likes.push(userId)
        await User.updateOne({_id:userId},{$push : {likedPosts:id}})
        await post.save()
  
        const notify = new Notify({
          from : userId,
          to: post.user,
          type:"like"
        })
        await notify.save()
        const updateLikes = post.likes
        res.status(200).json(updateLikes)
      }
  
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Comment post error"})
    }
}

export const createComment = async (req,res)=>{
    const {text} = req.body
    const id = req.params.id
    const userId = req.user.id
    try{
      if(!text){
        return res.status(400).json({error:"Comment is required"})
      }
      const post = await Post.findOne({_id:id})
      if(!post){
        return res.status(404).json({error:"post not found"})
      }
  
      const comment = {
        user:userId,
        text
      }
      post.comments.push(comment)
      await post.save()

      const notify = new Notify({
        from : userId,
        to: post.user,
        type:"comment"
      })
      await notify.save()
  
      res.status(200).json(post)
  
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Comment post error"})
    }
}


export const deletePost = async (req,res)=>{

    const {id} = req.params
    try{
      const post = await Post.findOne({_id:id})
      if(!post){
        return res.status(404).json({error:"Post not found"})
      }
      if(post.user.toString() !== req.user.id.toString()){
        return res.status(401).json({error:"Your not authorized"})
      }
      if(post.img){
        const imgId = post.img.split("/").pop().split('.')[0]
        await cloudinary.uploader.destroy(imgId)
      }
      await Post.findByIdAndDelete({_id:id})
      res.status(200).json({message:"Post deleted successfully"})
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Delete post error"})
    }
}

export const getAllposts = async(req,res)=>{
    try{
      const post = await Post.find().sort({createdAt: -1}).populate({
        path : "user",
        select : "-password"
      }).populate({
        path:"comments.user",
        select : ["-password","-email","-link","-bio"]
      })
      
      if(post.length === 0){
        return res.status(200).json([])
      }
      res.status(200).json(post)
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Get post error"})
    }
}

export const getLikedposts = async(req,res)=>{
    const id = req.params.id
    try{
      const user = await User.findOne({_id:id})
      if(!user){
        return res.status(404).json({error:"User not found"})
      }
  
      const likedPosts = await Post.find({_id :{$in : user.likedPosts}}).populate({
        path:"user",
        select:"-password"
      }).populate({
        path:"comments.user",
        select : ["-password","-email","-link","-bio"]
      })
      res.status(200).json(likedPosts)
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Get liked post error"})
    }
}

export const getFollowingposts = async(req,res)=>{
    const userId = req.user.id
    try{
      const user = await User.findOne({_id:userId})
      if(!user){
        return res.status(404).json({error:"User not found"})
      }
      const following = user.following
  
      const feedPosts = await Post.find({user : {$in : following}}).sort({createdAt:-1}).populate({
        path:"user",
        select:"-password"
      }).populate({
        path:"comments.user",
        select : "-password"
      })
  
      res.status(200).json(feedPosts)
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Get follow post error"})
    }
}

export const getUserposts = async(req,res)=>{
    const username = req.params.username
    try{
      const user = await User.findOne({username})
      if(!user){
        return res.status(404).json({error:"User not found"})
      }
  
      const posts = await Post.find({user : user._id}).sort({createdAt:-1}).populate({
        path:"user",
        select:"-password"
      }).populate({
        path:"comments.user",
        select : "-password"
      })
      res.status(200).json(posts)
    }catch(error){
      console.error(error)
      return res.status(500).json({error:"Get user post error"})
    }
}