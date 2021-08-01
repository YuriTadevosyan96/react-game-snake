import React from 'react';

import GameBoardCells from '../GameBoardCells/GameBoardCells';
import classes from './GameBoard.module.css';

const GameBoard = ({
  gameBoardRows,
  gameBoardColumns,
  totalCellAmount,
  foodCellIndex,
  snakeBodyIndexes,
  isMaxScoreReached,
}) => {
  const GameBoardStyles = {
    gridTemplateRows: `repeat(${gameBoardRows}, 1fr)`,
    gridTemplateColumns: `repeat(${gameBoardColumns}, 1fr)`,
  };

  return (
    <div style={GameBoardStyles} className={classes.GameBoard}>
      <GameBoardCells
        totalCellAmount={totalCellAmount}
        snakeBodyIndexes={snakeBodyIndexes}
        foodCellIndex={foodCellIndex}
        isMaxScoreReached={isMaxScoreReached}
      />
    </div>
  );
};

export default GameBoard;
