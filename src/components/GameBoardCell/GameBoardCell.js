import React from 'react';

import classes from './GameBoardCell.module.css';

const GameBoardCell = ({ isFoodCell, isSnakeBodyPart }) => {
  const appliedClasses = [classes.GameBoardCell];
  if (isFoodCell) {
    appliedClasses.push(classes.FoodCell);
  } else if (isSnakeBodyPart) {
    appliedClasses.push(classes.SnakeBodyPart);
  }

  return <div className={appliedClasses.join(' ')}></div>;
};

export default GameBoardCell;
