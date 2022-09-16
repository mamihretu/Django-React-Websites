import React, {useState} from "react";
import { Button, Grid, Typography,TextField,FormHelperText, 
        FormControl, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import {Link, useParams, useNavigate} from "react-router-dom";
import "../../static/css/index.css"; 


const CreateRoomPage = () => {
      var defaultVotes = 2;
      const [room, setRoom] = useState({
        guest_can_pause: true,
        votes_to_skip: defaultVotes
      });

      const navigate = useNavigate();


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


      function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = cookies[i].trim();
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
      }
  

      const createRoom = () => {
        var csrftoken = getCookie('csrftoken');
        console.log("csrf", csrftoken);
        const requestOptions = {
          credentials: 'include',
          method: 'POST',
          mode: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
          },
          body: JSON.stringify({
              votes_to_skip: room.votes_to_skip,
              guest_can_pause: room.guest_can_pause
          })
        };

        fetch('/api/create', requestOptions)
        .then((response) => response.json())
        .then((data) => navigate('/room/' + data.code));
      }

  

      return( 
        <div className = 'center'>

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
      </div>
      );
}

export default CreateRoomPage;