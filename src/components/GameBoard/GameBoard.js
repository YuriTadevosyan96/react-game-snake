import React from 'react';

import GameCells from '../GameCells/GameCells';
import classes from './GameBoard.module.css';

function GameBoard({ cellRowAmount, cellColumnAmount, foodCellIndex, snakeBodyCords }) {
  const GameBoardStyles = {
    gridTemplateRows: `repeat(${cellRowAmount}, 1fr)`,
    gridTemplateColumns: `repeat(${cellColumnAmount}, 1fr)`,
  };

  const totalCellAmount = cellRowAmount * cellColumnAmount;

  return (
    <div style={GameBoardStyles} className={classes.GameBoard}>
      <GameCells
        totalCellAmount={totalCellAmount}
        snakeBodyCords={snakeBodyCords}
        foodCellIndex={foodCellIndex}
      />
    </div>
  );
}

export default GameBoard;
