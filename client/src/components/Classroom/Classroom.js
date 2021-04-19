import React from 'react';
import { useHistory } from 'react-router-dom';
import qs from 'qs';

import classes from './Classroom.module.css';

const Classroom = (props) => {
  const history = useHistory();

  const clickHandle = (e) => {
    e.preventDefault();
    history.push({ pathname: '/posts', search: '?' + qs.stringify({ classId: props.classId, title: props.title }) });
  }

  return (
      <div className={classes.card} onClick={clickHandle}>
        <p className={classes.title}>{props.title}</p>
      </div>
  );
}

export default Classroom;
