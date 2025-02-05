import React, { useEffect, useState } from 'react'
import './follow.css'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa6'
import { useQuery } from '@tanstack/react-query'
import { baseUrl } from '../../../constant/url'
import axios from 'axios'
import image from '../../../images/avatar.webp'

const Follow = () => {
    const [follow,setFollow] = useState('followers')

    const {data} =useQuery({queryKey:["authUser"]})

    const endPoint = ()=>{
        switch(follow){
            case "followers":
                return `${baseUrl}/api/users/followers`;
            case "following":
                return `${baseUrl}/api/users/following`;
            default :
                return `${baseUrl}/api/users/followers`;
        }
    }

    const {data: followPerson,refetch} =  useQuery({
        queryKey: ["follow"],
        queryFn: async ()=>{
          try{
            const response = await axios.get(endPoint(),{withCredentials:true})   
            const res = response.data
            return res
            
          }catch(error){
            console.log(error)
            throw error
          }
        }    
      })
      console.log(followPerson)

    useEffect(()=>{
       refetch()
    },[refetch,follow])

    return (
    <div className='follow'>
        <div className='nameBoard d-flex w-100 bg-dark bg-opacity-50 position-sticky top-0 px-3 py-2 align-items-center'>
            <Link to={'/home'}><FaArrowLeft className='fs-4 me-4 text-light'/></Link>
            <div className='ms-2'>
                <h5>{data?.name}</h5>
                <small className='text-secondary'>{data?.username}</small>
            </div>
        </div>
        <header className='pt-1'>
                <div className='header position-sticky top-0'>
                    <div className="feed__header" onClick={()=>setFollow("followers")}> 
                        <h5 className='posts'>Followers</h5>
                        {follow === "followers" && (
							<div className='underline'></div>
						)}
                    </div>
                    <div className="feed__header" onClick={()=>setFollow("following")}>
                        
                        <h5 className='likes'>Following</h5>
                        {follow === "following" && (
							<div className='underline'></div>
						)}
                    </div>
                </div>
        </header>
        {
            follow ==="followers" &&
            followPerson?.followers?.map((follower,index)=>(
                <main key={index} className='d-flex justify-content-between align-items-center mx-3 py-2'>
                    <div className='d-flex align-items-start gap-4'>
                        <img className='rounded-pill' src={follower.profileImg ? follower.profileImg : image} alt="" width={50} height={50}/>
                        <div>
                            <h5>{follower.name}</h5>
                            <p>{follower.username}</p>
                            <em>{follower.bio}</em>
                        </div>
                    </div>
                    <div>
                        <button className='btn btn-light rounded-pill'>
                            follow
                        </button>
                    </div>
                </main>
            ))
        }
        {
            follow ==="following" &&
            followPerson?.following?.map((following,index)=>(
                <main key={index} className='d-flex justify-content-between align-items-center mx-3 py-2'>
                    <div className='d-flex align-items-start gap-4'>
                        <img className='rounded-pill' src={following.profileImg ? following.profileImg : image} alt="" width={50} height={50}/>
                        <div>
                            <h5>{following?.name}</h5>
                            <p>{following?.username}</p>
                            <em>{following?.bio}</em>
                        </div>
                    </div>
                    <div>
                        <button className='btn btn-light rounded-pill'>
                            follow
                        </button>
                    </div>
                </main>
            ))
        }
    </div>
  )
}

export default Follow