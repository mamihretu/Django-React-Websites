import React, {useState, useEffect} from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";



const RoomJoinPage = () => {
  const [page, setPage] = useState({
    roomID :"",
    error : false
  });

  const navigate = useNavigate();


  function loadRoomIDFromInput(e){
    setPage((previousState) => {
          return {...previousState, roomID: e.target.value}
    } );
    console.log("Just got changed to:", page.roomID);

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


  function joinRoom(){
    var csrftoken = getCookie('csrftoken');
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
          roomID: page.roomID
      })
    };    
    fetch('/api/join-room', requestOptions)
    .then((response) => {
      if(response.ok){
          navigate(`/room/${page.roomID}`);
      } else {
        (previousState) => {
          setPage({...previousState, error: true});
        }
      } 
    }).catch((error) => {
      console.log(error);
    })

  } 

  return(
    <div className = "center">
        <Grid container spacing={1} align="center">
            <Grid item xs = {12}>
                <Typography component="h4" variant="h4">
                      Join a Room
                </Typography> 
            </Grid>   
            <Grid item xs={12} align="center">
                <TextField 
                  error={page.error}
                  label="Code"
                  value={page.roomID}
                  helperText={page.error}
                  variant="outlined"
                  onChange = {loadRoomIDFromInput}
                  />
            </Grid> 
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={joinRoom} >
                    Enter Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to='/' component={Link}>Back</Button>
            </Grid>  
        </Grid>
    </div>
    )
}

export default RoomJoinPage;
