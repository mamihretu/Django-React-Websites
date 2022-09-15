import React, {useState} from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {Link} from "react-router-dom"; 


const CreateRoomPage = () => {
  var defaultVotes = 2;
  const [room, setRoom] = useState({
    guest_can_pause: true,
    votes_to_skip: defaultVotes
  });


  const updateVote = (e) => {
    setRoom(previousState => {
      return { ...previousState, votes_to_skip: e.target.value}
    });
  } 

  const updatePausePrivilage = (e) => {
    setRoom(previousState => {
      return { ...previousState, votes_to_skip: e.target.value === 'true' ? true : false}
    });
  } 

  const createRoom = () => {
    const requestOptions = {
      method: 'POST',
      headers: {'content-Type': 'application/json'},
      body: JSON.stringify({
          votes_to_skip: room.votes_to_skip,
          guest_can_pause: room.guest_can_pause
      })
    };

    fetch('/api/create/', requestOptions)
    .then((response) => response.json())
    .then((data) => console.log(data));

  }
  

  return( 
  <Grid container spacing = {1} >
    <Grid item xs={12} align='center'>
        <Typography component='h4' variant='h4'>
          Create a room
        </Typography>
    </Grid> 
    <Grid item xs={12} align='center'>
        <FormControl component='fieldset'>
            <FormHelperText>
                <div align='center'>
                  Guest Control of playback state
                </div>
            </FormHelperText>
            <RadioGroup row defaultValue='true' onChange = {updatePausePrivilage}>
                <FormControlLabel 
                    value='true' 
                    control={<Radio color = 'primary'/>}
                    label = 'Play/Pause'
                    labelPlacement = 'bottom'  
                />
                <FormControlLabel 
                    value='false' 
                    control={<Radio color = 'secondary'/>}
                    label = 'No control'
                    labelPlacement = 'bottom'  
                />                
            </RadioGroup>
        </FormControl>  
    </Grid> 
        <Grid item xs={12} align='center' >
            <FormControl>
                <TextField 
                  required ={true}
                  type = 'number'
                  onChange = {updateVote}
                  defaultValue = {defaultVotes}
                  inputProps = {{
                                 min:1,
                                 style: {textAlign : 'center'}
                               }}
                 />

                 <FormHelperText>
                    <div align =  'center'>
                        Votes required to skip
                    </div>
                 </FormHelperText>
            </FormControl>
        </Grid> 
        <Grid item xs={12} align='center'>
            <Button color= 'primary' variant ='contained' onClick = {createRoom}>
                Create a room
            </Button>
        </Grid>
        <Grid item xs={12} align='center'>
            <Button color= 'secondary' variant ='contained' to ='/' component = {Link}>
                Back
            </Button>
        </Grid>  
  </Grid>
  );
}

export default CreateRoomPage;