import HomePage from './components/HomePage';
import React, { useState, useEffect } from "react";
import RoomJoinPage from './components/RoomJoinPage';
import CreateRoomPage from './components/CreateRoomPage';
import Room from './components/Room';
import { 
  BrowserRouter as Router, 
  Route,
  Routes,
  Link,
  Navigate,
  useNavigate 
} from 'react-router-dom';




const App = () => {

	return(  
		<Router>
		    <Routes>
		        <Route path = '/'>
		            <Route index element = {<HomePage/>}/>
		            <Route  path = 'join' element = {<RoomJoinPage/>} />
		            <Route  path = 'create' element = {<CreateRoomPage/>} /> 
		            <Route path = 'room/:roomID' element = {<Room/>}/>
		        </Route>
		    </Routes>    
		</Router>
	);

}

export default App;



