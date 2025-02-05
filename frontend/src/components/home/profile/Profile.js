import React, { useEffect, useState } from 'react'
import './profile.css'
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { PiBalloonBold } from "react-icons/pi";
import image from "../../../images/avatar.webp"
import cv from "../../../images/cv.jpg"
import { Link, Outlet, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import {baseUrl} from '../../../constant/url'
import Posts from '../feed/posts/Posts';
import useFollow from '../../../hooks/useFollow'
import { Spinner } from 'react-bootstrap';

const Profile = () => {

    const {username} = useParams()
    const [feedType, setFeedtype] = useState("posts");

    const {data: authUser} = useQuery({queryKey: ["authUser"]})

    const {data: user,isLoading,refetch,isRefetching} = useQuery({
        queryKey:["userProfile"],
        queryFn: async ()=>{
            try{
                const response = await axios.get(`${baseUrl}/api/users/profile/${username}`,{withCredentials:true})
                const res = response.data
                return res
            }catch(error){
                throw error
            }
        }
    })

    useEffect(()=>{
        refetch()
    },[username,refetch])

    const date = new Date(user?.user?.createdAt)

    const formatDate = date.toLocaleDateString('en-US',{
        year: 'numeric',
        month:'long'
    })
    
    const {follow,isPending} = useFollow({})
    const following = authUser?.following.includes(user?._id)

  return (
    <main className='profile'>
			{ !isLoading && !isRefetching && user ? (
                <>
                <div>
                <div className='nameBoard d-flex w-100 bg-dark bg-opacity-50 position-sticky top-0 px-3 py-2 align-items-center'>
                    <Link to={'/home'}><FaArrowLeft className='fs-4 me-4 text-light'/></Link>
                    <div className='ms-2'>
                        <h5>{user?.user?.name}</h5>
                        <small className='text-secondary'>{user?.getCount} posts</small>
                    </div>
                </div>
                <div className='coverImg w-100 bg-secondary'>
                    <img src={user?.user?.coverImg ? user?.user?.coverImg : cv} alt="image-alt" width="100%" height="200px" />
                </div>
                <div className='profileArea w-100'>
                    <img src={user?.user?.profileImg ? user?.user?.profileImg : image} alt="profileImage" width={160} height={160} className='rounded-pill' />
                    {
                        authUser?._id === user?.user?._id ?
                        <>
                        <Link to={'update'}>
                        <button className='btn btn-outline-light rounded-pill'>Edit</button>
                        </Link>
                        <Outlet/>
                        </>
                        :
                        <button onClick={()=>{
                            follow(user?.user?._id)
                        }} className='btn btn-outline-light rounded-pill'>
                            {isPending && <Spinner size='sm' animation="border" variant="light" />}
                            {!isPending && following && "Unfollow"}
                        {!isPending && !following && "follow"}
                        </button>
                    }
                    
                </div>
                <div className='profileDetails py-3 ps-3'>
                    <div className='ms-2'>
                        <div className='my-2'>
                            <h4>{user?.user?.name}</h4>
                            <small className='text-secondary'>@{user?.user?.username}</small>
                        </div>
                        <p>{user?.user?.bio}</p>
                    </div>
                    <div className='d-flex gap-3 ms-2 my-2'>
                        <div className='gap-2 d-flex justify-content-center align-items-center'>
                            <PiBalloonBold/>
                            <span>Born {user?.user?.dob}</span>
                        </div>
                        <div className='gap-1 d-flex justify-content-center align-items-center'>
                            <IoCalendarOutline/>
                            <span>Joined {formatDate}</span>
                        </div>
                    </div>
                    <div className='ms-2 gap-4 d-flex align-items-center'>
                        <Link to={'/follow'}>
                            <span><b className='text-light me-1'>{user?.user?.followers?.length}</b> following</span>
                        </Link>
                        <Link to={'/follow'}>
                            <span><b className='text-light me-1'>{user?.user?.following?.length}</b> followers</span>
                        </Link>
                    </div>
                    <div className='m-2'>
                        <a href={user?.user?.link}>{user?.user?.link}</a>
                    </div>
                </div>
            </div>
            <header>
                <div className='header position-sticky top-0'>
                    <div className="feed__header" onClick={()=>setFeedtype("posts")}> 
                        <h5 className='posts'>Posts</h5>
                        {feedType === "posts" && (
							<div className='underline'></div>
						)}
                    </div>
                    <div className="feed__header" onClick={()=>setFeedtype("likes")}>
                        
                        <h5 className='likes'>Likes</h5>
                        {feedType === "likes" && (
							<div className='underline'></div>
						)}
                    </div>
                </div>
            </header>
            <Posts username={username} feedType = {feedType} userId={user?.user?._id}/>
                </>
            ) : 
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        }
    </main>
  )
}

export default Profile