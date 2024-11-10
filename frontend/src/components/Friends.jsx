import React from 'react'
import shield from '../img/security.png'
import SuggestedFriendsSkeleton from './skeletons/SuggestedFriendsSkeleton';
import LoadingSpinner from './common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useFollow from '../hooks/useFollow';

export default function Friends() {

	const {data: suggestedUsers, isLoading} = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async() => {
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "Failed to fetch suggested users");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		}
	})

	const {follow, isPending} = useFollow();

	if(suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

	return (
		<div className='club'>
			<div className='club-container'>
			<img src={shield}/>
			<h3>Suggested Friends</h3>
			</div>
			<div className='flex flex-col gap-4'>
						{/* item */}
						{isLoading && (
							<>
								<SuggestedFriendsSkeleton />
								<SuggestedFriendsSkeleton />
							</>
						)}
						{!isLoading &&
							suggestedUsers?.map((user) => (
								<Link
									to={`/profile/${user._id}`}
									className='flex items-center justify-between gap-4'
									key={user._id}
								>
									<div className='flex gap-2 items-center'>
										<div className='avatar'>
											<div className='w-8 rounded-full'>
												<img src={user.profileImg || "/avatar-placeholder.png"} />
											</div>
										</div>
										<div className='flex flex-col'>
											<span className='font-semibold tracking-tight truncate w-28'>
												{user.firstName} {user.lastName}
											</span>
											<span className='text-sm text-slate-500'>@{user.location}</span>
										</div>
									</div>
									<div>
										<button
											className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
											onClick={(e) => {
												e.preventDefault();
												follow(user._id);
											}}
										>
											{isPending ? <LoadingSpinner size = 'sm' /> : "Follow"}
										</button>
									</div>
								</Link>
							))}
					</div>
		</div>
	)
}
