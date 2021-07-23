import React from 'react';

import classes from './Score.module.css';

function Score({ score, isMaxScoreReached }) {
  return (
    <h2 className={classes.Score}>
      {isMaxScoreReached ? 'Congratulations you reached maximum score ' : 'Current Score: '}
      {score}
    </h2>
  );
}

export default Score;
