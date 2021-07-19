import React from 'react';

import classes from './GameCell.module.css';

function GameCell({ isFoodCell, isSnakeBodyPart }) {
  const appliedClasses = [classes.GameCell];
  if (isFoodCell) {
    appliedClasses.push(classes.FoodCell);
  } else if (isSnakeBodyPart) {
    appliedClasses.push(classes.SnakeBodyPart);
  }

  return <div className={appliedClasses.join(' ')}></div>;
}

export default GameCell;
