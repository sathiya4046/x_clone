import React from 'react';
import SignUp from './components/auth/Signup/SignUp';
import { Navigate, Route, Routes } from 'react-router-dom';
import Homepage from './components/home/Homepage';
import CreateAccount from './components/auth/createAccount/CreateAccount';
import SignIn from './components/auth/signIn/SignIn';
import Dialog from '@mui/material/Dialog';
import Missing from './Missing';
import Update from './components/home/profile/update/Update';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { baseUrl } from './constant/url';
import Profile from './components/home/profile/Profile';
import RightPanel from './components/home/rightPanel/RightPanel';
import Sidebar from './components/home/sidebar/Sidebar';
import Notify from './components/home/notification/Notify';
import Follow from './components/home/followers/Follow';


function App() {

  const {data: authUser,isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: async ()=>{
      try{
        const response = await fetch(`${baseUrl}/api/auth/me`,{
          method:"GET",
          credentials:"include",
          headers:{
            "Content-type" : "application.json"
          }
        })

        const res = await response.json()
        if(res.error){
          return null
        }
        if(!response.ok){
          throw new Error(res.error || "Something went wrong")
        }
        return res
        
      }catch(error){
        console.log(error)
        throw error
      }
    },
    retry:false     
  })

  if(isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
    </div>
    )
  }
  return (
    <div className="App d-flex">
      {authUser && <Sidebar/>}
      <Routes>
        <Route path='/' element={!authUser ? <SignUp/> : <Navigate to='/home'/> }>
              <Route path='signUp' element={ !authUser ? (
                <Dialog open
                fullWidth>
                  <CreateAccount/>
                </Dialog>
              ) : <Navigate to='/home'/> }
              />
              <Route path='signIn' element={ !authUser ? (
                <Dialog open
                fullWidth>
                  <SignIn/>
              </Dialog>
              ) : <Navigate to='/home'/>}
              />
        </Route>
        <Route path='/home' element={authUser ? <Homepage /> : <Navigate to="/"/>}/>
        <Route path='profile/:username' element={authUser ? <Profile/> : <Navigate to = "/"/>}>
            <Route path='update' element={authUser ? (
              <Dialog open
              fullWidth>
                <Update/>
              </Dialog>
            ) : <Navigate to='/'/>}
            />
          </Route>
        <Route path='*' element={authUser ? <Homepage /> : <Missing/>}/>
        <Route path='/notifications' element={authUser ? <Notify /> : <Navigate to='/' />} />
        <Route path='/follow' element={authUser ? <Follow /> : <Navigate to='/' />} />
      </Routes>
      {authUser && <RightPanel/>}
      <Toaster />
    </div>
  );
}

export default App;
