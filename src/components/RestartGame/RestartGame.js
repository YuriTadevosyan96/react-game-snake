import React from 'react';

import classes from './RestartGame.module.css';

const RestartGame = ({ restartHandler }) => {
  return (
    <button onClick={restartHandler} className={classes.RestartGame} type="button">
      Restart Game
    </button>
  );
};

export default RestartGame;
