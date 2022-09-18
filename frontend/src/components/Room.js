import React, {useState, useEffect} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@mui/material';
import "../../static/css/index.css"; 

const Room = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [room, setRoom] = useState({
		votes_to_skip: 2,
		guest_can_pause: false,
		is_host: false
	});

	function leaveRoom() {
		const requestOptions = {
			method : 'post',
			headers : {'contentType': 'application/json'},

		};

		fetch('/api/leave-room', requestOptions)
		.then(response => navigate('/'));
	}

	
	
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
		<Grid container className= 'center' spacing={1}>
			<Grid item xs={12} align="center">
				<Typography variant='h4' component='h4'>
					RoomID : {params.roomCode}
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<Typography variant='h6' component='h6'>
					Votes: {room.votes_to_skip}
				</Typography>			
				
			</Grid>
			<Grid item xs={12} align="center">
				<Typography variant='h6' component='h6'>
					Guest can pause: {room.guest_can_pause.toString()}
				</Typography>				
			</Grid>	
			<Grid item xs={12} align="center">
				<Typography variant='h6' component='h6'>
					Host: {room.is_host.toString()}
				</Typography>				
			</Grid>
			<Grid item xs={12} align="center">
			    <Button color= 'secondary' variant ='contained' onClick = {leaveRoom} >
                    Leave Room
                </Button>			
			</Grid>


		</Grid>
		);

}

export default Room;