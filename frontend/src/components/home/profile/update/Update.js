import React, { useRef, useState } from 'react'
import './update.css'
import TextField from '@mui/material/TextField';
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { MenuItem, FormControl, InputLabel, Select, Stack, Popover, Button} from '@mui/material';
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import upload_area from './upload_area.svg'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { baseUrl } from '../../../../constant/url';
import toast from 'react-hot-toast';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const Update = () => {

  const navigate = useNavigate()
    const {data: authUser} = useQuery({queryKey:["authUser"]})
    const username = authUser?.username

    const currentYear = new Date().getFullYear();
    const [name, setName] = useState(authUser?.name)
    const [bio, setBio] = useState(authUser?.bio)
    const [link,setLink] = useState(authUser?.link)
    
    let dateparts = authUser?.dob.split(" ")

    const [selectedMonth, setSelectedMonth] = useState(dateparts[1]);
    const [selectedDate, setSelectedDate] = useState(dateparts[0]);
    const [selectedYear, setSelectedYear] = useState(dateparts[2]);
    let dob = `${selectedDate} ${selectedMonth} ${selectedYear}`
      
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
      ];
    const days = Array.from({ length: 31 }, (_, index) => index + 1);
    const years = Array.from({ length: 50 }, (_, index) => currentYear - index); 

    const [oldPassword,setoldPassword] = useState('')
    const [showOldPassword, setShowOldPassword] = useState(false);
        
    const handleClickOldPassword = () => {
            setShowOldPassword((prev) => !prev);
    };

    const [newPassword,setNewPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false);
        
    const handleClickNewPassword = () => {
            setShowNewPassword((prev) => !prev);
    };

    const [password,setPassword] = useState("")

    const queryClient = useQueryClient()

    const { mutate:update,isPending  } = useMutation({
      mutationFn : async (data) =>{
        try{
          const formData = {
            name: data.name,
            bio : data.bio,
            link : data.link,
            profileImg : data.profileImg,
            coverImg : data.coverImg,
            dob:data.dob,
            password:data.password
          }
          const response = await axios.post(`${baseUrl}/api/users/update`,formData,{withCredentials:true})
          if(!response){
            throw new Error(response?.data?.error || "Something went wrong")
          }
          return response
  
        }catch(error){
          console.error(error)
          throw error
        }
      },
      onSuccess: () => {
        toast.success('User updated successfully');
        Promise.all([
          queryClient.invalidateQueries({queryKey:["authUser"]}),
          queryClient.invalidateQueries({queryKey:["userProfile"]})
        ])
        navigate(`/profile/${username}`)
      },
      onError: (error) => {
        toast.error(error);
      }
    })

    function validate(oldPassword,newPassword){
        if(!oldPassword && !newPassword) {
            return "Required password"
        }
        else if(!oldPassword && newPassword) {
            return "old password required"
        }
        else if(oldPassword && !newPassword) {
          return "new password required"
        }
        else if(oldPassword===newPassword){
          return "Both are same password"
        }
        else{
          return newPassword
        }
    }

    //coverImg

    const [anchorEl, setAnchorEl] = useState(null);
    const [image, setImage] = useState(null);
    const [popover,setpopover] = useState(true)
    const [cropImg,setCropImage] = useState(true)
    const [croppedImage, setCroppedImage] = useState(null);


    const cropperRef = useRef(null);


    const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result);
        reader.readAsDataURL(file);
      }
  };

  const handleCrop = () => {
    setCropImage(false)
    setpopover(false)
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      const croppedDataUrl = croppedCanvas.toDataURL();
      setCroppedImage(croppedDataUrl);
    }
  };

  //profileImg

  const [anchorEl1, setAnchorEl1] = useState(null);
  const [image1, setImage1] = useState(null);
  const [popover1,setpopover1] = useState(true)
  const [cropImg1,setCropImage1] = useState(true)
  const [croppedImage1, setCroppedImage1] = useState(null);


  const cropperRef1 = useRef(null);


  const handlePopoverOpen1 = (event) => setAnchorEl1(event.currentTarget);
  const handlePopoverClose1 = () => setAnchorEl1(null);

  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage1(reader.result);
      reader.readAsDataURL(file);
    }
};

const handleCrop1 = () => {
  setCropImage1(false)
  setpopover1(false)
  if (cropperRef1.current) {
    const croppedCanvas = cropperRef1.current.cropper.getCroppedCanvas();
    const croppedDataUrl = croppedCanvas.toDataURL();
    setCroppedImage1(croppedDataUrl);
  }
};

//submit

  const handleSubmit = (e)=>{
    e.preventDefault()
    setPassword(validate(oldPassword,newPassword))
    update({name,dob,bio,link,password,profileImg:croppedImage1,coverImg:croppedImage})
  }

  return (
    <div className='vh-100'>       
        <div className='bg-dark text-light'>
        <div className='d-flex justify-content-between align-items-center position-sticky top-0 p-2 bg-dark bg-opacity-75'>
            <Link className='fs-2 text-light' to={`/profile/${username}`}><IoMdClose />
            </Link>
            <h4 className='fw-bold mt-2'>Edit profile</h4>
            <button disabled={isPending} onClick={handleSubmit} className='btn btn-light w-25 rounded-pill'>{isPending ? "updating..."  : "Save"}</button>
        </div>
        <div className='mx-4'>
            <div className='my-3 d-flex flex-column' onClick={handlePopoverOpen}>
                <label htmlFor="coverimage">
                  {
                    croppedImage ?
                    <img className='w-100' src={croppedImage} alt="thumbnail_img" width={100} height={150}/>
                    :
                    <img className='w-100' src={authUser?.coverImg ? authUser?.coverImg : upload_area} alt="thumbnail_img" width={100} height={150}/>
                  }
                </label>
                <input 
                    onChange={handleFileChange} 
                    type="file" 
                    name='coverimage' 
                    id='coverimage' 
                    hidden
                />
            </div>
                {
                      popover &&
                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                        >
                            <div className='text-center' style={{ padding: '15px', width: '60vh',height:"60vh" }}>
                            {image && cropImg && (
                                <div>
                                <Cropper
                                    ref={cropperRef}
                                    src={image}
                                    style={{ width: '50vh', height: '50vh' }}
                                    guides={false}
                                />
                                <Button onClick={handleCrop} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                                    Crop Image
                                </Button>
                                </div>
                            )}
                            </div>
                        </Popover>
                        }
            <div className='my-3 d-flex flex-column' onClick={handlePopoverOpen1}>
                <label htmlFor="profileimage">
                  {
                    croppedImage1 ?
                    <img className='rounded-pill p-2 m-1' src={croppedImage1} alt="crop_img" width={100} height={100}/>
                    :
                    <img className='rounded-pill p-2 m-1' src={authUser?.profileImg ? authUser?.profileImg : upload_area} alt="thumbnail_img" width={100} height={100}/>
                  }
                </label>
                <input 
                    onChange={handleFileChange1} 
                    type="file" 
                    name='profileimage' 
                    id='profileimage' 
                    hidden
                />
            </div>
            {
                      popover1 &&
                        <Popover
                            open={Boolean(anchorEl1)}
                            anchorEl={anchorEl1}
                            onClose={handlePopoverClose1}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                        >
                            <div className='text-center' style={{ padding: '15px', width: '60vh',height:"60vh" }}>
                            {image1 && cropImg1 && (
                                <div>
                                <Cropper
                                    ref={cropperRef1}
                                    src={image1}
                                    style={{ width: '50vh', height: '50vh' }}
                                    guides={false}
                                />
                                <Button onClick={handleCrop1} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                                    Crop Image
                                </Button>
                                </div>
                            )}
                            </div>
                        </Popover>
                        }
          <TextField
            autoFocus
            required
            margin="dense"
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
            name="bio"
            label="Bio"
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
            value={bio}
            onChange={(e)=>setBio(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="link"
            label="Website"
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
            value={link}
            onChange={(e)=>setLink(e.target.value)}
          />
          <div className='d-flex gap-3'>
          <TextField
            autoFocus
            required
            margin="dense"
            name="oldPassword"
            label="Old password"
            type={showOldPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton className='text-light' onClick={handleClickOldPassword}>
                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
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
            value={oldPassword}
            onChange={(e)=>setoldPassword(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="newPassword"
            label="New password"
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton className='text-light' onClick={handleClickNewPassword}>
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
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
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
          />
          </div>
          <div className='my-3 py-3'>
            <h5>Date of birth</h5>
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
        </div>
        </div>
    </div>
  )
}

export default Update