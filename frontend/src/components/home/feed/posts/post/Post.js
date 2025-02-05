import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import getRelativeTime from '../../../../../constant/PostTime'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { baseUrl } from '../../../../../constant/url'
import toast from 'react-hot-toast'
import image from '../../../../../images/avatar.webp'
import { MdDeleteOutline } from "react-icons/md";
import { FaArrowRight, FaRegComment, FaRegHeart } from "react-icons/fa";
import './post.css'
import { Popover } from '@mui/material';



const Post = ({post,index}) => {

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const isMypost = authUser?._id === post?.user?._id

    const isLiked = post.likes.includes(authUser._id);

    const queryClient = useQueryClient()

    const {mutate: deletepost} = useMutation({
       mutationFn : async (id) =>{
           try{
               const res = await axios.delete(`${baseUrl}/api/posts/delete/${id}`,{withCredentials:true})
               return res
           }catch(error){
               throw error
           }
       },
       onSuccess : ()=>{
           toast.success("Post deleted")
           queryClient.invalidateQueries({
               queryKey:["posts"]
           })
       }
    })

    const handleDelete = (id) =>{
       deletepost(id)
    }

    const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const res = await axios.post(`${baseUrl}/api/posts/like/${post._id}`,{},{withCredentials:true});

				const data = res.data

				return data;
			} catch (error) {
				throw error
			}
		},
		onSuccess: (updateLikes) => {
			// queryClient.setQueryData(["posts"]);

            queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updateLikes };
					}
					return p;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

    const handleLike = () =>{
        if (isLiking) return;
		likePost();
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const [comment, setComment] = useState("");

    const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);

    const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async (text) => {
			try {
				const res = await axios.post(`${baseUrl}/api/posts/comment/${post._id}`,text,{withCredentials:true});

				const data = res.data

				return data;
			} catch (error) {
				throw error
			}
		},
		onSuccess: () => {
            toast.success("comment successfully")
            setComment("")
            queryClient.invalidateQueries({queryKey:["posts"]})
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

    const handleComment = ()=>{
        if(isCommenting) return
        commentPost({text:comment})
    }
 
  return (
    <div>
        <div key={index} className='d-flex flex-column w-100 post'>
            <div className='d-flex align-items-center justify-content-between mt-3 w-100'>
                <div className='d-flex align-items-center justify-content-between'>
                        <div className='mx-3'>
                            <Link className='text-light text-decoration-none' to={`/profile/${post.user.username}`}>
                                <img src={post.user.profileImg ? post.user.profileImg : image} alt="profileimage" width={50} height={50} className='rounded-pill' />
                            </Link>
                        </div>
                        <div>
                            <div className='d-md-flex align-items-center justify-content-between'>
                                <Link className='text-light text-decoration-none' to={`/profile/${post.user.username}`}>
                                <h4 className='me-3'>{post.user.name}</h4>
                                </Link>
                                <small className='me-3 text-secondary'>@{post.user.username}</small>
                                <small className='text-secondary'>{getRelativeTime(post.createdAt)}</small>
                            </div>
                        </div>
                </div>
                                    {
                                        isMypost && 
                                        <button className='btn text-light me-3 fs-4' onClick={()=>handleDelete(post._id)}><MdDeleteOutline className='text-danger'/></button>
                                    }
            </div>
                            <div>
                                <div className='m-4'>
                                    <p>{post.text}</p>
                                    { post.img && <img src={post.img} alt="postimage" width="100%" height={420} className='rounded' />}
                                    
                                </div>
                                <div className='d-flex align-items-center  justify-content-between my-3 mx-5 fs-5'>
                                    <div>
                                        <FaRegComment onClick={handlePopoverOpen} className='me-2'/> 
                                        <span>{post.comments.length}</span>
                                        <Popover
                                            aria-hidden="false"
                                            open={Boolean(anchorEl)}
                                            anchorEl={anchorEl}
                                            onClose={handlePopoverClose}
                                            anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                            }}
                                        >
                                            <div className='p-2 border border-secondary text-light' style={{backgroundColor:"black", width: '40vh',height:"50vh", wordBreak:"break-all",textWrap:"wrap",overflow:"auto" }}>
                                            <h3>Comments</h3>
                                            <hr />
                                                <div>
                                                    {
                                                        post?.comments?.map((comment,index)=>(
                                                            <div key={index} className='d-flex w-100 my-3'>
                                                            <img className='rounded-pill me-2' src={comment.user.profileImg ? comment.user.profileImg : image} alt="commentImg" width={40} height={40} />
                                                            <p>{comment.text} </p>
                                                            </div>
                                                        ))
                                                    }
                                                    <div className='mb-2 d-flex justify-content-evenly align-items-center position-absolute bottom-0 w-100'>
                                                        <input 
                                                            type="text" 
                                                            className='w-75 rounded-pill py-1 me-2 p-3 border border-dark'
                                                            placeholder='write here'
                                                            onChange={(e)=>setComment(e.target.value)}
                                                            value={comment}
                                                        />
                                                        <button onClick={handleComment} disabled={isCommenting} className='w-25 btn btn-outline-light rounded-pill me-3'>
                                                            <FaArrowRight/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Popover>
                                    </div>
                                    <div style={{cursor:"pointer"}} onClick={handleLike}>
                                        {!isLiked && !isLiking && (
									        <FaRegHeart className=' me-2 text-light' />
								        )}
								        {isLiked && !isLiking && (
									        <FaRegHeart className='me-2 text-danger' />
								        )}
                                        <span>{post?.likes?.length}</span>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
        </div>
    </div>
  )
}

export default Post