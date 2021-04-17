import React from 'react';

import classes from './Classroom.module.css';

const classroom = (props) => {
    return (
        <div className={classes.card}>
          <p className={classes.title}>{props.title}</p>
        </div>
    );
}

export default classroom;
