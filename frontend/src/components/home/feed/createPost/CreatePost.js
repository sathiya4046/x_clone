import React,{ useRef, useState } from 'react'
import defImage from '../../../../images/avatar.webp'
import { MdOutlinePhoto } from "react-icons/md";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';
import { baseUrl } from '../../../../constant/url';
import toast from 'react-hot-toast';
import { Popover, Button } from '@mui/material';

const CreatePost = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [image, setImage] = useState(null);
    const [text,setText] = useState('')
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
    

    const {data : authUser } = useQuery({queryKey:["authUser"]})

    const queryClient = useQueryClient()

    const {mutate:createPost, isPending}= useMutation({
        mutationFn : async (data) =>{
            try{
                const formData = {
                    img : data.image,
                    text : data.text
                }
                const res = await axios.post(`${baseUrl}/api/posts/create`,formData,{withCredentials:true})
                const response = res.data

                return response

            }catch(error){
                alert(error)
                throw error
            }
        },
        onSuccess : ()=>{
            setImage(null)
            setText("")
            setCroppedImage(null)
            toast.success("Post created")
            queryClient.invalidateQueries({
                queryKey:["posts"]
            })
        }
    })

    const handleSubmit = (e)=>{
        e.preventDefault()
        createPost({text:text,image:croppedImage});
    }
  return (
    <div>
        <div className='formArea'>
                    <div className='d-flex'>
                        <div className='image'>
                            <img src={authUser?.profileImg ? authUser?.profileImg : defImage} alt="profileimage" width={50} height={50} className='rounded-pill' />
                        </div>
                        <form className='w-100 my-2' onSubmit={(e)=>handleSubmit(e)}>
                            <div className='mb-3'>
                                <textarea 
                                    className='p-3' 
                                    rows={2} 
                                    placeholder='What is happening?!'
                                    value={text}
                                    onChange={(e)=>setText(e.target.value)}
                                ></textarea>
                                {croppedImage && !cropImg && (
                                                <div>
                                                <img src={croppedImage} alt="Cropped" style={{ width: '95%', height: '50vh' }} className='rounded' />
                                                </div>
                                )}
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='d-flex w-100'>
                                    <div onClick={handlePopoverOpen}>
                                        <label className='mx-3 fs-3' htmlFor="postimage">< MdOutlinePhoto/></label>
                                        <input 
                                            onChange={handleFileChange} 
                                            type="file" 
                                            name='img'
                                            id='postimage' 
                                            hidden
                                        />
                                        {
                                            popover &&
                                            <Popover
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
                                            <div className='text-center' style={{ padding: '15px', width: '100%',height:"60vh" }}>
                                            {image && cropImg && (
                                                <div>
                                                <Cropper
                                                    ref={cropperRef}
                                                    src={image}
                                                    style={{ width: '50vh', height: '50vh' }}
                                                    aspectRatio={16/9}
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
                                    </div>
                                    <div className='fs-3'><MdOutlineEmojiEmotions/></div>
                                </div>
                                <button disabled={isPending} type='submit' className='me-3 btn btn-light rounded-pill w-25'>{isPending ? "Posting" : "Post"}</button>
                            </div>
                        </form>
                    </div>
                </div>
    </div>
  )
}

export default CreatePost