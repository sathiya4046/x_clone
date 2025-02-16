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
    const [croppedImage, setCroppedImage] = useState({});
    const [fileType, setFileType] = useState(null);
    const [file, setFile] = useState(null);

    const cropperRef = useRef(null);


    const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        setFileType(file.type.startsWith('image') ? 'image' : 'video');

        if (file.type.startsWith("image")) {
          const reader = new FileReader();
          reader.onload = () => setImage(reader.result);
          reader.readAsDataURL(file);
        }else {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleCrop = () => {
        setCropImage(false)
        setpopover(false)
        if (cropperRef.current && fileType === 'image') {
          const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
          const dataUrl = croppedCanvas.toDataURL();
          const resourceType = 'image';
          setCroppedImage({dataUrl,resourceType});
        }
    };

    const uploadVideo = async ()=>{
        setCropImage(false)
        setpopover(false)
        if(fileType === 'video'){
            const videoBlob = await fetch(image).then((r) => r.blob());
            const videoFile = new File([videoBlob], file.name, { type: file.type });
            const dataUrl = await convertVideoToDataURL(videoFile);
            const resourceType = 'video';
            setCroppedImage({dataUrl,resourceType});
        }
    }

    const convertVideoToDataURL = (videoFile) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(videoFile);
        });
      };
    

    const {data : authUser } = useQuery({queryKey:["authUser"]})

    const queryClient = useQueryClient()

    const {mutate:createPost, isPending}= useMutation({
        mutationFn : async (data) =>{
            try{
                const formData = {
                    img : data.image,
                    text : data.text,
                    resource_type:data.resource_type
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
        createPost({text:text,image:croppedImage?.dataUrl,resource_type: croppedImage?.resourceType});
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
                                {croppedImage?.resourceType === "image" && !cropImg && (
                                                <div>
                                                <img src={croppedImage.dataUrl} alt="Cropped" style={{ width: '95%', height: '50vh' }} className='rounded' />
                                                </div>
                                )}
                                {croppedImage?.resourceType === "video" && !cropImg && (
                                                <div>
                                                <video width='100%' height={280} controls>
                                                <source src={croppedImage.dataUrl} type='video/mp4' />
                                                Your browser does not support the video tag.
                                                </video>
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
                                            accept="image/*,video/*"
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
                                            {image && cropImg && fileType ==='image' && (
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
                                            {image && fileType === 'video' && (
                                                <div>
                                                    <video width="100%" height="380" controls>
                                                    <source src={image} type={file.type} />
                                                    Your browser does not support the video tag.
                                                    </video>
                                                    <Button onClick={uploadVideo} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                                                    Upload
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