import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, ButtonGroup, Typography } from '@mui/material';
import "../../static/css/index.css"; 




function HomePageLayout(){
  return (
    <Grid container spacing={3} className='center'>
    	<Grid item xs={12} align="center">
    		<Typography variant="h2" >
    			Party Room
    		</Typography>
    	</Grid>
    	<Grid item xs={12} align="center">
    		<ButtonGroup disableElevation variant="contained" color="primary">
    			<Button color="primary" to='/join' component={ Link }>
    				Join a Room
    			</Button>
    			<Button color="secondary" to='/create' component={ Link }>
    				Create a Room
    			</Button>    			
    		</ButtonGroup>
    	</Grid>
    </Grid>
    );
}



export default HomePageLayout;