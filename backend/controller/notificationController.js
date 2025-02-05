import Notify from "../models/notifySchema.js"

export const getNotifications = async (req,res)=>{
    const id = req.user.id
    try{
        const notification = await Notify.find({to : id}).populate({
            path:"from",
            select:"username profileImg"
        })

        await Notify.updateMany({to: id},{read:true})

        res.status(200).json(notification)
      }catch(error){
        console.error(error)
        return res.status(500).json({error:"Notification get error"})
      }
}

export const deleteNotifications = async (req,res)=>{
    const id = req.user.id
    try{
        await Notify.deleteMany({to: id})
        res.status(200).json({message:"Notification deleted successfully"})
      }catch(error){
        console.error(error)
        return res.status(500).json({error:"Notification delete error"})
      }
}