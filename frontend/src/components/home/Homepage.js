import React, { useState } from 'react'
import Feed from './feed/Feed'
import Profile from './profile/Profile'


const Homepage = () => {
  const [profileOpen, setprofileOpen] = useState(false)

  return (
    <div className='border border-secondary'>
      {
        profileOpen ? 
        <Profile 
        setprofileOpen= {setprofileOpen}
        /> :   
        <Feed />
      }
    </div>
  )
}

export default Homepage