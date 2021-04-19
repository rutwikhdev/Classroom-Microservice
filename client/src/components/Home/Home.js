import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { useHistory } from 'react-router-dom';

import styles from './Home.module.css';
import Classroom from '../Classroom/Classroom';

const Home = () => {
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState({});
  const history = useHistory();

  const userId = cookie.load('userId');

  const logoutCookie = () => {
    cookie.remove('userId', { path: '/' });
    history.push({pathname: '/login'});
  }

  const createClass = async () => {
    console.log('Creating class');
    await axios.post('http://localhost:4001/create_class', {
      userId, title
    });
  }

  const joinClass = async () => {
    console.log('Joining class');
    await axios.post('http://localhost:4001/add_class', {
      userId, classId
    });
  };

  const fetchClasses = async () => {
    const res = await axios.get('http://localhost:4001/get_classes/' + userId);

    setClasses(res.data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  var renderedClasses = <div></div>;
  if (Object.keys(classes).length > 0) {
    renderedClasses = Object.values(classes.data).map(post => {
      return (
        <Classroom key={post.classId} classId={post.classId} title={post.title} />
      );
    });
  }

  return (

    <div className={styles.homeCover}>

      <div className={styles.formStyles}>
        <form onSubmit={createClass}>
        <input
            value={title}
            type="text"
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Title" />
          <button className={styles.btn}>CREATE CLASS</button>
        </form>

        <form onSubmit={joinClass}>
          <input
            value={classId}
            type="text"
            onChange={e => setClassId(e.target.value)}
            required
            placeholder="Classroom ID" />
          <button className={styles.btn}>JOIN CLASS</button>
        </form>
        </div>

        <form onSubmit={logoutCookie}>
          <button className={styles.logoutBtn}>LOGOUT</button>
        </form>

        <div className={styles.classSection}>
          {renderedClasses}
        </div>
    </div>
  );
}

export default Home;
