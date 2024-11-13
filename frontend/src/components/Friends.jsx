import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import React from 'react'
import shield from '../img/security.png'
import userplaceholder from '../img/user.png'

import useFollow from '../hooks/useFollow';

export default function Friends() {

	const {data: suggestedUsers, isLoading} = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async() => {
			try {
				const res = await fetch("/api/user/suggested");
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "Failed to fetch suggested users");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		}, retry: false
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
						{isLoading && "Loading..."}
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
												<img src={user.profileImg || userplaceholder} />
											</div>
										</div>
										<div className='flex flex-col'>
											<span className='font-semibold tracking-tight truncate w-28'>
												{user.firstname} {user.lastname}
											</span>
										</div>
									</div>
									<div>
										<button
											className='follow-button'
											onClick={(e) => {
												e.preventDefault();
												follow(user._id);
											}}
										>
											{isPending ? "Loading..." : "Follow"}
										</button>
									</div>
								</Link>
							))}
					</div>
		</div>
	)
}
