import React  from 'react'
import XIcon from '@mui/icons-material/X';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import './signup.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'


const SignUp = () => {

  const navigate = useNavigate()

  return (
    <div className='container'>
      <div className='m-4 twitter'>
      <main className='main'>
      <section className='logosection'>
        <XIcon className='logo'/>
      </section>
      <section className='signup px-lg-5'>
        <h1>Happening now</h1>
        <h4>Join today.</h4>
        <div className='content'>
        <button className='google'>
          <FcGoogle className='fs-5 me-2'/>
          <a href="/">Sign up with Google</a>
        </button>
        <button className='apple'>
          <FaApple  className='fs-5 appleicon'/>
          <a href="/">Sign up with Apple</a>
        </button>
        <div className='line'>
          <div></div>
          <p>or</p>
          <div></div>
        </div>
        <button className='createaccount' onClick={()=>navigate("/signUp")}>
          <Link to="/signUp">Create account</Link>
        </button>
        <Outlet/>
        <div className='terms'>
          <small>By signing up, you agree to the <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>, including <a href="/">Cookie Use</a>.</small>
        </div>
        <h5>Already have an account?</h5>
        <button className='signin' onClick={()=>navigate('/signIn')}>
          <Link to="/signIn">Sign in</Link>
        </button>
        <Outlet/>
        </div>
      </section>
      </main>
      <footer className='footer'>
        <a href="/">About</a>
        <a href="/">Download the X app</a>
        <a href="/">Help Center</a>
        <a href="/">Terms of Service</a>
        <a href="/">Privacy Policy</a>
        <a href="/">Cookie Policy</a>
        <a href="/">Accessibility</a>
        <a href="/">Ads info</a>
        <a href="/">Blog</a>
        <a href="/">Careers</a>
        <a href="/">Brand Resources</a>
        <a href="/">Advertising</a>
        <a href="/">Marketing</a>
        <a href="/">X for Business</a>
        <a href="/">Developers</a>
        <a href="/">Directory</a>
        <a href="/">Settings</a>
        <span>&copy; 2025 X Corp</span>
      </footer>
      </div>
    </div>
  )
}

export default SignUp