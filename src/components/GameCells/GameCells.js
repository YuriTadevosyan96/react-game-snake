import React from 'react';

import GameCell from '../GameCell/GameCell';

function GameCells({ totalCellAmount, foodCellIndex, snakeBodyCords }) {
  const gameCells = new Array(totalCellAmount).fill();

  return gameCells.map((_, cellIndex) => {
    const isSnakeBodyPart = snakeBodyCords.some(
      (snakeBodyPartIndex) => snakeBodyPartIndex === cellIndex
    );
    return (
      <GameCell
        key={cellIndex}
        isFoodCell={foodCellIndex === cellIndex}
        isSnakeBodyPart={isSnakeBodyPart}
      />
    );
  });
}

export default GameCells;
