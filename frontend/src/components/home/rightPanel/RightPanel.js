import React from 'react'
import "./rightPanel.css"
import SearchIcon from "@material-ui/icons/Search"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { baseUrl } from '../../../constant/url'
import { Link } from 'react-router-dom'
import image from '../../../images/avatar.webp'
import useFollow from '../../../hooks/useFollow'

function RightPanel() {

    const {data: suggestUser}=useQuery({
        queryKey:["suggestUser"],
        queryFn: async ()=>{
            try{
                const res = await axios.get(`${baseUrl}/api/users/suggested`,{withCredentials:true})
                const response = res.data 
                return response
            }catch(error){
                console.log(error)
                throw error
            }
        }
    })

    const {follow,isPending} = useFollow()

    return (
        <div className="rightPanel col" >
            <div className="rightPanel__input">
                <SearchIcon className="text-secondary" />
                <input placeholder="Search" type="text" />
            </div>
            <div className="rightPanelContainer">
                <h4>Who to follow</h4>
                {
                    suggestUser?.map((user,index)=>(
                        
                        <div key={index} className='d-flex justify-content-between align-items-center mt-4'>
                                <Link className=' text-light text-decoration-none d-flex align-items-center w-100' to={`/profile/${user?.username}`}>
                                    <img className='me-4 ms-2 rounded-pill border' src={user?.profileImg ? user?.profileImg : image} alt="img" width={60} height={60} />
                                    <div className='d-flex w-50 flex-column align-items-start'>
                                        <h5>{user?.name}</h5>
                                        <small>{user?.username}</small>
                                    </div>
                                </Link>
                            <button disabled={isPending} onClick={(e)=>{
                                e.preventDefault()
                                follow(user._id)
                            }} className='btn btn-light rounded-pill '>{isPending ? "following" : "follow"}</button>
                        </div>
                    ))
                }

            </div>

        </div>
    )
}

export default RightPanel