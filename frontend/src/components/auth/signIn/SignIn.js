import React, { useState } from 'react'
import './SignIn.css'
import TextField from '@mui/material/TextField';
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom';
import XIcon from '@mui/icons-material/X';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { baseUrl } from '../../../constant/url';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const SignIn = () => {
  // const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const queryClient = useQueryClient()

  const { mutate:signIn,isPending,isError,error }= useMutation({
    mutationFn : async ({email,password}) =>{
      try{
        const response = await axios.post(`${baseUrl}/api/auth/signIn`,{email,password},{withCredentials:true})
        if(!response){
          throw new Error(response.data.error || "Something went wrong")
        }
        console.log(response)
        return response

      }catch(error){
        console.error(error)
        throw error
      }
    },
    onSuccess: () => {
      toast.success('Login successfully');
      queryClient.invalidateQueries({
        queryKey : ["authUser"]
      })
    },
    onError: (error) => {
      toast.error(error.message);
    }

  })

  const handleSubmit = (e)=>{
    e.preventDefault()
    signIn({email,password})
  }

  return (
    <div>
        <div className='bg-dark text-light'>
            <div>
                <Link className='fs-2 text-light ms-2' to={'/'} ><IoMdClose />
                </Link>
                <XIcon className='mx-auto w-100'/>
            </div>
            <div className='mx-auto dialogbox'>
            <h1 className='fw-bold mt-5'>Sign in to X</h1>
            <button className='google mt-4'>
                      <FcGoogle className='fs-5 me-2'/>
                      <a href="/">Sign up with Google</a>
                    </button>
                    <button className='apple mt-3'>
                      <FaApple  className='fs-5 appleicon'/>
                      <a href="/">Sign up with Apple</a>
                    </button>
                    <div className='line'>
                      <div></div>
                      <p>or</p>
                      <div></div>
                    </div>
              <TextField
                autoFocus
                required
                margin="dense"
                name="email"
                label="Phone, email, or username"
                type="email"
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'gray',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'aqua',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'gray',
                    '&.Mui-focused': {
                      color: 'aqua',
                    },
                  },'& .MuiInputBase-input': {
                  color: 'white',
                  },
                }}
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <TextField
                  className='mt-3'
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton className='text-light' onClick={handleClickShowPassword}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'gray',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'aqua',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'gray',
                      '&.Mui-focused': {
                        color: 'aqua',
                      },
                    },'& .MuiInputBase-input': {
                    color: 'white',
                    },
                  }}
                />
              
              <button disabled={isPending} onClick={handleSubmit} className='apple my-3 fw-bold'>
                <Link to="/">{isPending ? "Loading..." : "Next"}</Link>
            </button>
            {isError && <div className='py-2 mb-2 text-danger'>{error.message}</div>}
            <button className='signin'>
                <Link className='text-light' to="/">Forgot password?</Link>
            </button>
            <div className='mt-5 pb-2 fw-light text-secondary'><p>Don't have an account?<a className='text-decoration-none' href="/">Sign up</a></p></div>
            </div>
        </div>
    </div>
  )
}

export default SignIn