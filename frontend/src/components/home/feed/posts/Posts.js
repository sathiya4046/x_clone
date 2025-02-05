import React, { useEffect } from 'react'
import './posts.css'
import { useQuery } from '@tanstack/react-query';
import { baseUrl } from '../../../../constant/url'
import axios from 'axios'
import Post from './post/Post.js';

const Posts = ({username,feedType, userId}) => {

    const postEndPoint = ()=>{
        switch(feedType){
            case "forYou":
                return `${baseUrl}/api/posts/all`;
            case "following" :
                return `${baseUrl}/api/posts/following`;
            case "posts" :
                return `${baseUrl}/api/posts/user/${username}`;
            case "likes" :
                return `${baseUrl}/api/posts/likes/${userId}`;
            default :
                return `${baseUrl}/api/posts/all`;
        }
    }

    const {data: posts,refetch,isLoading} =  useQuery({
        queryKey: ["posts"],
        queryFn: async ()=>{
          try{
            const response = await axios.get(postEndPoint(),{withCredentials:true})
    
            const res = response.data
            return res
            
          }catch(error){
            console.log(error)
            throw error
          }
        }    
      })

      useEffect(()=>{
        refetch()
      },[refetch,feedType])

  return (
    <div className='section position-relative'>
        <section>
            {!isLoading  && posts?.length === 0 && (
				<p className='text-center my-4'>No posts found</p>
			)}
            {
                posts?.map((post,index)=>(
                    <Post key={index} post={post} index={index}/>
                ))
            }
        </section>
    </div>
  )
}

export default Posts