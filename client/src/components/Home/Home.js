import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import classes from './Home.module.css';
import Classroom from '../Classroom/Classroom';
import axios from 'axios';

const Home = (props) => {
  const [classId, setClassId] = useState("");
  const location = useLocation();

  const userId = location.state.id;
  
  // const classes = axios.get('http://localhost:4001/get_classes/' + userId);
  // console.log(classes)


  // add creating classroom func
  // when a class is created also add the same class to the user that creates the class
  const createClass = async (e) => {
    e.preventDefault();
    console.log('Creating class');
    await axios.post('http://localhost:4001/create_class', {
      userId
    });
  }

  // add classroom joining functionality to button
  const joinClass = async () => {
    console.log('Joining class');
    await axios.post('http://localhost:4001/add_class', {
      userId
    });
  };
  // make request to get all associated classes from classroom service
  const getClassrooms = async () => {
    await axios.post('http://localhost:4001/get_classes', {
      userId
    });
  }
  // display every classroom linked to using arrays and a smaller component

  return (
    <div className={classes.homeCover}>
      <div>
        <form onSubmit={createClass}>
          <button>create class test</button>
        </form>
        
        <form onSubmit={joinClass}>
          <input
            value={classId}
            type="text"
            onChange={e => setClassId(e.target.value)}
            required
            placeholder="Classroom ID" />
          <button className={classes.btn}>+</button>
        </form>
        
        id: {userId}
      </div>
    </div>
  );
}

export default Home;
