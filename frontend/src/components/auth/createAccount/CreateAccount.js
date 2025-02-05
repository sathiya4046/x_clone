import React, { useState } from 'react'
import './createAccount.css'
import TextField from '@mui/material/TextField';
import { IoMdClose } from "react-icons/io";
import { Link} from 'react-router-dom';
import XIcon from '@mui/icons-material/X';
import { MenuItem, FormControl, InputLabel, Select, Stack} from '@mui/material';
import axios from 'axios'
import {baseUrl} from '../../../constant/url'
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const CreateAccount = () => {
  // const navigate = useNavigate()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const dob = `${selectedDate} ${selectedMonth} ${selectedYear}`

  const currentYear = new Date().getFullYear();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const years = Array.from({ length: 50 }, (_, index) => currentYear - index); 

  const [showPassword, setShowPassword] = useState(false);
  
  const handleClickShowPassword = () => {
      setShowPassword((prev) => !prev);
  };

  const queryClient = useQueryClient()

  const { mutate:signUp,isPending,isError,error }= useMutation({
    mutationFn : async ({name,email,dob,password,username}) =>{
      try{
        const response = await axios.post(`${baseUrl}/api/auth/signUp`,{name,email,dob,password,username},{withCredentials:true})
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
      toast.success('User created successfully');
      queryClient.invalidateQueries({
        queryKey : ["authUser"]
      })
    },
    onError: (error) => {
      toast.error(error);
    }

  })

  const handleSubmit = (e)=>{
    e.preventDefault()
    signUp({name,email,dob,password,username})
  }



  return (
    <div>
        
        <div className='bg-dark text-light'>
        <div>
            <Link className='fs-2 text-light ms-2' to={'/'}><IoMdClose />
            </Link>
            <XIcon className='mx-auto w-100'/>
        </div>
        <div className='dialog mx-auto'>
        <h1 className='fw-bold my-4'>Create your account</h1>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
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
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="username"
            label="Username"
            type="text"
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
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email"
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
            autoFocus
            required
            margin="dense"
            id="name"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
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
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <div className='my-3'>
            <h5>Date of birth</h5>
            <small>This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</small>
            <Stack className='mt-4' direction="row" spacing={2} alignItems='center' justifyContent="space-between">
                <FormControl sx={{
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
               width: 200 }}>
                    <InputLabel>Month</InputLabel>
                    <Select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} label="Month">
                    {months.map((month, index) => (
                        <MenuItem key={index} value={month}>
                        {month}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl sx={{
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
               width: 120 }}>
                    <InputLabel>Day</InputLabel>
                    <Select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} label="Day">
                    {days.map((day) => (
                        <MenuItem key={day} value={day}>
                        {day}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl sx={{
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
               width: 150 }}>
                    <InputLabel>Year</InputLabel>
                    <Select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} label="Year">
                    {years.map((year) => (
                        <MenuItem key={year} value={year}>
                        {year}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Stack>
          </div>
          <button disabled={isPending} onClick={handleSubmit} className='w-100 my-4 btn btn-light fs-5 fw-bold rounded-pill' type="submit">{isPending ? "loading..."  : "Next"}</button>
          {isError && <div className='py-2 text-danger'>Error : {error.message}</div>}
        </div>
        </div>
    </div>
  )
}

export default CreateAccount