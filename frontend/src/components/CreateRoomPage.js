import React, { useState, useEffect } from "react";
import { Button, Grid, Typography,TextField,FormHelperText, 
        FormControl, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import {Link, useParams, useNavigate} from "react-router-dom";
import "../../static/css/index.css"; 


const CreateRoomPage = () => {

    const [room, setRoom] = useState({
                                    guest_can_pause: true,
                                    votes_to_skip: 2,
                                    roomID: null
                                    });
    const [authenticated, setAuthenticatioin] = useState(false);
    const params = useParams();
    const navigate = useNavigate();


    const updateVote = (e) => {
        setRoom(previousState => {
          console.log("votes_to_skip:", e.target.value);
          return { ...previousState, votes_to_skip: e.target.value}
          
        });
    } 

    const updatePausePrivilage = (e) => {
        setRoom(previousState => {
          console.log("guest_can_pause:", e.target.value);
          return { ...previousState, guest_can_pause: e.target.value === 'true' ? true : false}
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

        try{
         fetch('/api/create', requestOptions)
        .then((response) => response.json())
        .then((data) => {
            setRoom({ guest_can_pause: data.guest_can_pause,
                      votes_to_skip: data.votes_to_skip,
                      roomID: data.roomID
                        });
            setAuthenticatioin(data.authenticated);            
        });
        
        if (!authenticated){
            go_to_auth_url();
        }

        }
        catch(err){
            console.log(err);
        }




    }







    function go_to_auth_url(){
        fetch('/api/get-auth-url')
        .then((response)=> response.json())
        .then((data) => {
            window.location.replace(data.url);
        });
                

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
                <FormHelperText component='span'>
                    <span align='center'>
                      Guest Control of playback state
                    </span>
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
                      defaultValue = {2}
                      inputProps = {{
                                     min:1,
                                     style: {textAlign : 'center'}
                                   }}
                     />

                     <FormHelperText component='span'>
                        <span align =  'center'>
                            Votes required to skip
                        </span>
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