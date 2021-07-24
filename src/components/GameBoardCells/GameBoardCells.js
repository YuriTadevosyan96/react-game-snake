import React from 'react';

import GameCell from '../GameBoardCell/GameBoardCell';

function GameBoardCells({ totalCellAmount, foodCellIndex, snakeBodyIndexes, isMaxScoreReached }) {
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
        isFoodCell={foodCellIndex === cellIndex && !isMaxScoreReached}
        isSnakeBodyPart={isSnakeBodyPart}
      />
    );
  });
}

export default GameBoardCells;
