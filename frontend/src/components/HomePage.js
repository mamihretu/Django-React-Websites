import React, { useState, useEffect } from "react";
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';
import HomePageLayout from './HomePageLayout';
import { 
  BrowserRouter as Router, 
  Route,
  Routes,
  Link,
  Navigate 
} from 'react-router-dom';





const HomePage = () => {
      const [roomCode, setRoomCode] = useState(null);


      // TODO: make this work
      // useEffect(() => {
      //     async function checkBeenHere() {
      //     return (await fetch('/api/user-in-room')
      //                            .then(response => response.json())
      //                            .then(data => setRoomCode(data.code)))
      //     };
      //     checkBeenHere();
      //     console.log("Async called")
      // }, []);


      return(  
        <Router>
            <Routes>
                <Route  path = '/'>
                    <Route index element={<HomePageLayout/>}/>
                    <Route  path = 'join' element = {<RoomJoinPage/>} />
                    <Route  path = 'create' element = {<CreateRoomPage/>} /> 
                    <Route path = 'room/:roomCode' element = {<Room/>}/>
                </Route>
            </Routes>    
        </Router>
        );
}

export default HomePage;



