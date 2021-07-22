import React from 'react';

import classes from './Score.module.css';

function Score({ score }) {
  return <h2 className={classes.Score}>Current Score: {score}</h2>;
}

export default Score;
