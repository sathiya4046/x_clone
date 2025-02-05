import React from "react";
import "./Sidebar.css";
import XIcon from '@mui/icons-material/X';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import { baseUrl } from "../../../constant/url";
import image from '../../../images/avatar.webp'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Sidebar() {

  const queryClient = useQueryClient()

    const { mutate:logout }= useMutation({
        mutationFn : async () =>{
          try{
            const response = await axios.post(`${baseUrl}/api/auth/logout`,{},{withCredentials:true})
            return response
          }catch(error){
            console.error(error)
            throw error
          }
        },
        onSuccess: () => {
          toast.success('Logout successfully');
          queryClient.invalidateQueries({
            queryKey:["authUser"]
          })
        },
        onError: (error) => {
          toast.error("Logout unsuccessfull");
        }
    
      })
    
      const handleLogout = (e)=>{
        e.preventDefault()
        logout()
      }

      const {data: authUser} = useQuery({queryKey:["authUser"]})

    return (
        <aside className="sidebar position-sticky top-0 vh-100">
            <div className="sideBarcontent">
              <Link className="text-decoration-none text-light" to={'/home'}>
              <XIcon className="fs-1 ms-lg-2 logo"/>
              </Link>
              <div className="list-unstyled my-5">
                  <Link className="text-decoration-none text-light" to={'/home'}>
                    <li key='home'><HomeIcon className="me-3  fs-2"/><span>Home</span></li>
                  </Link>
                  <Link className="text-decoration-none text-light" to={'/notifications'}>
                  <li key='notify'><NotificationsNoneOutlinedIcon className="me-3 fs-2"/><span>Notifications</span></li>
                  </Link>
                  <Link className="text-decoration-none text-light" to={`profile/${authUser?.username}`}>
                    <li key='profile'><Person2OutlinedIcon className="me-3 fs-2"/><span>Profile</span></li>
                  </Link>
                  <li key='logout' onClick={handleLogout}><LogoutIcon className="me-3 fs-2"/><span>Logout</span></li>
              </div>
              <div className="profile position-fixed bottom-0 mb-4">
                  <Link className="text-light text-decoration-none d-lg-flex px-4 justify-content-between align-items-center" to={`/profile/${authUser?.username}`}>
                    <img className="rounded-pill me-2" src={authUser?.profileImg ? authUser?.profileImg :image} alt="img" width={50} height={50} />
                    <div className="title mt-2">
                        <h5>{authUser?.name}</h5>
                        <p>{authUser?.username}</p>
                    </div>
                  </Link>
              </div>
            </div>
        </aside>
    )
}

export default Sidebar