import React from 'react';

import classes from './GameBoardCell.module.css';

const GameBoardCell = ({ isFoodCell, isSnakeBodyPart, isSnakeHead }) => {
  const appliedClasses = [classes.GameBoardCell];
  if (isSnakeHead) {
    appliedClasses.push(classes.SnakeHead);
  } else if (isSnakeBodyPart) {
    appliedClasses.push(classes.SnakeBodyPart);
  } else if (isFoodCell) {
    appliedClasses.push(classes.FoodCell);
  }
  return <div className={appliedClasses.join(' ')}></div>;
};

export default GameBoardCell;
