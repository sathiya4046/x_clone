import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Spinner } from 'react-bootstrap';
import axios from 'axios'
import {baseUrl} from '../../../constant/url'
import './notify.css'


const Notify = () => {
	const queryClient = useQueryClient();
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await axios.get(`${baseUrl}/api/notifications`,{withCredentials:true});
				const response = await res.data;
				return response;
			} catch (error) {
				throw new Error(error);
			}
		}
	});

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await axios.delete(`${baseUrl}/api/notifications`,{withCredentials:true});
				const response = await res.data;

				if (!res.ok) throw new Error(response.error || "Something went wrong");
				return response;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<>
			<div className='notify'>
				<div className='d-flex justify-content-between align-items-center pt-3 px-3 border-bottom'>
					<p className='fw-bold fs-4'>Notifications</p>
					<div>
							<p>
								<a href="/notifications" onClick={deleteNotifications}>Delete all notifications</a>
							</p>
					</div>
				</div>
				{isLoading && (
					<div className='d-flex justify-content-center vh-100 align-items-center'>
						<Spinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 fw-bold'>No notifications 🤔</div>}
				{notifications?.map((notification,index) => (
					<div className="p-3" key={index}>
							<Link className="text-decoration-none" to={`/profile/${notification?.from?.username}`}>
								<div className="d-flex align-items-end gap-3 text-light">
									<img className='rounded-pill' src={notification?.from?.profileImg || "/frontend/src/images/avatar.webp"} alt="notify" width={50} height={50} />
									<h6>@{notification?.from?.username} 
										<span className="ms-2">
											{notification?.type === "follow" && "followed you"}
											{notification?.type === "like" && "liked your post"}
											{notification?.type === "comment" && "commented your post"}
										</span>
									</h6>
								</div>
							</Link>
					</div>
				))}
			</div>
		</>
	);
};
export default Notify;