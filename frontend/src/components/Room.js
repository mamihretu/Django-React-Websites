import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

const Room = () => {

	const [room, setRoom] = useState({
		votes_to_skip: 2,
		guest_can_pause: false,
		is_host: false
	});

	const params = useParams();
	
	useEffect(() => {
		fetch('/api/get-room' + '?code=' + params.roomCode)
		.then((response) => response.json())
		.then((data) => {
			setRoom({votes_to_skip: data.votes_to_skip,
					 guest_can_pause: data.guest_can_pause,
					 is_host: data.is_host})
		})

	}, [params])


	return(
		<div>
			<h3> Roomcode : {params.roomCode}</h3>
			<p> Votes: {room.votes_to_skip}</p>
			<p> Guest can pause: {room.guest_can_pause.toString()}</p>
			<p> Host: {room.is_host.toString()}</p>
		</div>
		);

}

export default Room;