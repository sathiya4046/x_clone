import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { baseUrl } from '../constant/url'
import toast from 'react-hot-toast'

const useFollow = () => {
    const queryClient = useQueryClient()
    const {mutate:follow, isPending} = useMutation({
        mutationFn: async (userId)=>{
            try{
                const res = await axios.post(`${baseUrl}/api/users/follow/${userId}`,{},{withCredentials:true})
                const response = res.data
                return response
            }catch(error){
                throw error
            }
        },
        onSuccess : ()=>{
            Promise.all([
                queryClient.invalidateQueries({queryKey:["suggestUser"]}),
                queryClient.invalidateQueries({queryKey:["authUser"]})
            ])
        },
        onError : (error)=>{
            toast.error(error.message)
        }
    })
  return {follow,isPending}
}

export default useFollow