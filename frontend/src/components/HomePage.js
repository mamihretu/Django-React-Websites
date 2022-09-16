import React, {useState} from "react";
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';
import { 
  BrowserRouter as Router, 
  Route,
  Routes,
  Link,
  Redirect 
} from 'react-router-dom';


const HomePage = () => {
  const [page, setPage] = useState("");

  return(  
    <Router>
        <Routes>
            <Route path = '/'> 
                <Route  path = 'join' element = {<RoomJoinPage/>} />
                <Route  path = 'create' element = {<CreateRoomPage/>} /> 
                <Route path = 'room/:roomCode' element = {<Room/>}/>
            </Route>
        </Routes>    
    </Router>
    );
}

export default HomePage;



