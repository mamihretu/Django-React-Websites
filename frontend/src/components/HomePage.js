import React, {useState} from "react";
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
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
        <Route exact path = '/' />  
        <Route  path = '/join' element = {<RoomJoinPage/>} />
        <Route  path = '/create' element = {<CreateRoomPage/>} /> 
      </Routes>    
    </Router>
    );
}

export default HomePage;



