import React from 'react';

import GameCell from '../GameBoardCell/GameBoardCell';

const GameBoardCells = ({
  totalCellAmount,
  foodCellIndex,
  snakeBodyIndexes,
  isMaxScoreReached,
}) => {
  const gameBoardCells = new Array(totalCellAmount).fill();

  return gameBoardCells.map((_, cellIndex) => {
    let isSnakeBodyPart = snakeBodyIndexes.some(
      (snakeBodyPartIndex) => snakeBodyPartIndex === cellIndex
    );

    if (isMaxScoreReached) {
      isSnakeBodyPart = true;
    }

    return (
      <GameCell
        key={cellIndex}
        isSnakeHead={snakeBodyIndexes[0] === cellIndex}
        isFoodCell={foodCellIndex === cellIndex}
        isSnakeBodyPart={isSnakeBodyPart}
      />
    );
  });
};

export default GameBoardCells;
