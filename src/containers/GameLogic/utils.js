const _generateRandomFoodCellIndex = (totalCellAmount) => {
  return Math.floor(Math.random() * totalCellAmount);
};

export const calcSnakeBodyPartIndexZeroBased = (row, column, gameBoardColumns) => {
  const index = (row - 1) * gameBoardColumns + column;
  return index - 1;
};

const _matchWithSnakeBodyCords = (snakeBodyCords, randomFoodCellIndex, gameBoardColumns) => {
  return snakeBodyCords.some((bodyPartCords) => {
    const snakeBodyPartIndex = calcSnakeBodyPartIndexZeroBased(
      bodyPartCords.row,
      bodyPartCords.column,
      gameBoardColumns
    );

    return snakeBodyPartIndex === randomFoodCellIndex;
  });
};

export const generateNotOccupiedCellIndex = (snakeBodyCords, totalCellAmount, gameBoardColumns) => {
  let randomFoodCellIndex = _generateRandomFoodCellIndex(totalCellAmount);

  while (_matchWithSnakeBodyCords(snakeBodyCords, randomFoodCellIndex, gameBoardColumns)) {
    console.log('random index cell regenerate');
    randomFoodCellIndex = _generateRandomFoodCellIndex(totalCellAmount);
  }

  return randomFoodCellIndex;
};

export const snakeBodyPartsIndexesZeroBased = (snakeBodyCords, gameBoardColumns) => {
  return snakeBodyCords.map((snakeBodyPartCords) =>
    calcSnakeBodyPartIndexZeroBased(
      snakeBodyPartCords.row,
      snakeBodyPartCords.column,
      gameBoardColumns
    )
  );
};
