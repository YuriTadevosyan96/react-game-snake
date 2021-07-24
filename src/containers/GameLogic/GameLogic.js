import React, { useEffect, useReducer } from 'react';

import GameBoard from '../../components/GameBoard/GameBoard';
import GameOver from '../../components/GameOver/GameOver';
import Score from '../../components/Score/Score';

const GAME_BOARD_ROWS = 10;
const GAME_BOARD_COLUMNS = 11;
const GAME_BOARD_TOTAL_CELLS = GAME_BOARD_ROWS * GAME_BOARD_COLUMNS;
const GAME_STEP_INTERVAL = 500; // milliseconds

const gameInitialState = {
  snakeBodyCords: [
    { row: 5, column: 6, direction: 'UP' },
    { row: 6, column: 6, direction: 'UP' },
  ], // [{row: Number, column: Number, direction: enum(UP, DOWN, LEFT, RIGHT)}, ...]
  snakeHeadDirection: 'UP', // enum(UP, DOWN, LEFT, RIGHT)
  gameScore: 0,
  foodCellIndex: null,
  gameOver: false,
  isMaxScoreReached: false,
};

const gameControlReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FOOD_CELL_INITIAL_INDEX':
      return setFoodCellIndexInitialState(state);
    case 'CHANGE_SNAKE_HEAD_DIRECTION_UP':
      return updateSnakeHeadDirectionState(state, 'UP');
    case 'CHANGE_SNAKE_HEAD_DIRECTION_DOWN':
      return updateSnakeHeadDirectionState(state, 'DOWN');
    case 'CHANGE_SNAKE_HEAD_DIRECTION_LEFT':
      return updateSnakeHeadDirectionState(state, 'LEFT');
    case 'CHANGE_SNAKE_HEAD_DIRECTION_RIGHT':
      return updateSnakeHeadDirectionState(state, 'RIGHT');
    case 'RUN_GAME_LOGIC':
      return runGameLogic(state);
    default:
      throw new Error('Unknown action type provided!');
  }
};

const setFoodCellIndexInitialState = (state) => {
  return {
    ...state,
    foodCellIndex: generateNotOccupiedCellIndex(state.snakeBodyCords),
  };
};

const updateSnakeHeadDirectionState = (gameState, direction) => {
  const updatedSnakeBodyCords = [...gameState.snakeBodyCords];
  updatedSnakeBodyCords[0] = { ...updatedSnakeBodyCords[0], direction: direction };
  return {
    ...gameState,
    snakeBodyCords: updatedSnakeBodyCords,
    snakeHeadDirection: direction,
  };
};

const generateRandomFoodCellIndex = () => {
  return Math.floor(Math.random() * GAME_BOARD_TOTAL_CELLS);
};

const calcSnakeBodyPartIndexZeroBased = (row, column) => {
  const index = (row - 1) * GAME_BOARD_COLUMNS + column;
  return index - 1;
};

const isFoodCellIndexMatchingWithSnakeBodyCords = (snakeBodyCords, foodCellIndex) => {
  return snakeBodyCords.some((bodyPartCords) => {
    const snakeBodyPartIndex = calcSnakeBodyPartIndexZeroBased(
      bodyPartCords.row,
      bodyPartCords.column
    );

    return snakeBodyPartIndex === foodCellIndex;
  });
};

const generateNotOccupiedCellIndex = (snakeBodyCords) => {
  let randomFoodCellIndex = generateRandomFoodCellIndex();

  while (isFoodCellIndexMatchingWithSnakeBodyCords(snakeBodyCords, randomFoodCellIndex)) {
    console.log('random index cell regenerate');
    randomFoodCellIndex = generateRandomFoodCellIndex();
  }

  return randomFoodCellIndex;
};

const convertSnakeBodyCordsToZeroBasedIndexes = (snakeBodyCords) => {
  return snakeBodyCords.map((snakeBodyPartCords) =>
    calcSnakeBodyPartIndexZeroBased(snakeBodyPartCords.row, snakeBodyPartCords.column)
  );
};

const isSnakeHeadHitTheWall = (snakeHeadCords) => {
  const { row, column } = snakeHeadCords;

  if (
    row === 0 ||
    row === GAME_BOARD_ROWS + 1 ||
    column === 0 ||
    column === GAME_BOARD_COLUMNS + 1
  ) {
    return true;
  }

  return false;
};

const isSnakeHeadOverlapItsOwnBody = (snakeBodyCords, snakeHeadCords) => {
  for (
    let snakeBodyPartIndex = 1;
    snakeBodyPartIndex < snakeBodyCords.length;
    snakeBodyPartIndex++
  ) {
    if (
      snakeBodyCords[snakeBodyPartIndex].row === snakeHeadCords.row &&
      snakeBodyCords[snakeBodyPartIndex].column === snakeHeadCords.column
    ) {
      return true;
    }
  }

  return false;
};

const isGameOver = (snakeBodyCords) => {
  const snakeHeadCords = snakeBodyCords[0];
  if (
    isSnakeHeadHitTheWall(snakeHeadCords) ||
    isSnakeHeadOverlapItsOwnBody(snakeBodyCords, snakeHeadCords)
  ) {
    return true;
  }

  return false;
};

const isSnakeHeadIndexMatchWithFoodCellIndex = (snakeHeadCords, foodCellIndex) => {
  const snakeHeadIndex = calcSnakeBodyPartIndexZeroBased(snakeHeadCords.row, snakeHeadCords.column);

  if (snakeHeadIndex === foodCellIndex) {
    return true;
  }

  return false;
};

const updateGameStateSnakeHeadOnFoodCell = (gameState, snakeHeadCords) => {
  const snakeBodyCordsUpdated = [snakeHeadCords, ...gameState.snakeBodyCords];

  return {
    ...gameState,
    snakeBodyCords: snakeBodyCordsUpdated,
    foodCellIndex: generateNotOccupiedCellIndex(snakeBodyCordsUpdated),
    gameScore: gameState.gameScore + 1,
  };
};

const isMaxScoreReached = (snakeBodyCords, foodCellIndex) => {
  const snakeHeadCords = snakeBodyCords[0];
  if (snakeBodyCords.length === GAME_BOARD_TOTAL_CELLS - 1) {
    const snakeHeadIndex = calcSnakeBodyPartIndexZeroBased(
      snakeHeadCords.row,
      snakeHeadCords.column
    );
    if (snakeHeadIndex === foodCellIndex) {
      return true;
    }
  }
  return false;
};

const updateSnakeBodyCordsBasedOnDirection = (snakeBodyCords, snakeHeadDirection) => {
  const snakeBodyCordsUpdated = [];

  const updateSnakeBodyPartDirection = (previousPartDirection, row, column) => {
    snakeBodyCordsUpdated.push({ direction: previousPartDirection, row, column });
  };

  let prevPartDirection;
  for (
    let snakeBodyPartIndex = 0;
    snakeBodyPartIndex < snakeBodyCords.length;
    snakeBodyPartIndex++
  ) {
    const { row, column, direction } = snakeBodyCords[snakeBodyPartIndex];

    if (snakeBodyPartIndex > 0) {
      prevPartDirection = snakeBodyCords[snakeBodyPartIndex - 1].direction;
    } else {
      prevPartDirection = snakeHeadDirection;
    }

    if (direction === 'UP') {
      updateSnakeBodyPartDirection(prevPartDirection, row - 1, column);
    } else if (direction === 'DOWN') {
      updateSnakeBodyPartDirection(prevPartDirection, row + 1, column);
    } else if (direction === 'LEFT') {
      updateSnakeBodyPartDirection(prevPartDirection, row, column - 1);
    } else if (direction === 'RIGHT') {
      updateSnakeBodyPartDirection(prevPartDirection, row, column + 1);
    }
  }

  return snakeBodyCordsUpdated;
};

const runGameLogic = (gameState) => {
  const { snakeBodyCords, snakeHeadDirection, foodCellIndex, gameScore } = gameState;

  const snakeBodyCordsUpdated = updateSnakeBodyCordsBasedOnDirection(
    snakeBodyCords,
    snakeHeadDirection
  );

  if (isMaxScoreReached(snakeBodyCordsUpdated, foodCellIndex)) {
    return { ...gameState, isMaxScoreReached: true, gameScore: gameScore + 1 };
  }

  if (isGameOver(snakeBodyCordsUpdated)) {
    return { ...gameState, gameOver: true };
  }

  if (isSnakeHeadIndexMatchWithFoodCellIndex(snakeBodyCordsUpdated[0], foodCellIndex)) {
    return updateGameStateSnakeHeadOnFoodCell(gameState, snakeBodyCordsUpdated[0]);
  }

  return { ...gameState, snakeBodyCords: snakeBodyCordsUpdated };
};

function GameLogic() {
  const [gameState, dispatch] = useReducer(gameControlReducer, gameInitialState);

  useEffect(() => {
    dispatch({ type: 'SET_FOOD_CELL_INITIAL_INDEX' });
  }, []);

  useEffect(() => {
    const gameControlKeyDownHandler = (event) => {
      const snakeHeadCurrentDirection = gameState.snakeHeadDirection;
      switch (event.key) {
        case 'ArrowUp':
          if (snakeHeadCurrentDirection !== 'DOWN')
            dispatch({ type: 'CHANGE_SNAKE_HEAD_DIRECTION_UP' });
          break;
        case 'ArrowDown':
          if (snakeHeadCurrentDirection !== 'UP')
            dispatch({ type: 'CHANGE_SNAKE_HEAD_DIRECTION_DOWN' });
          break;
        case 'ArrowLeft':
          if (snakeHeadCurrentDirection !== 'RIGHT')
            dispatch({ type: 'CHANGE_SNAKE_HEAD_DIRECTION_LEFT' });
          break;
        case 'ArrowRight':
          if (snakeHeadCurrentDirection !== 'LEFT')
            dispatch({ type: 'CHANGE_SNAKE_HEAD_DIRECTION_RIGHT' });
          break;
        default:
      }
    };

    document.addEventListener('keydown', gameControlKeyDownHandler);

    return () => {
      document.removeEventListener('keydown', gameControlKeyDownHandler);
    };
  }, [gameState]);

  useEffect(() => {
    const gameCycle = setTimeout(() => {
      dispatch({ type: 'RUN_GAME_LOGIC' });
    }, GAME_STEP_INTERVAL);

    if (gameState.gameOver || gameState.isMaxScoreReached) {
      clearTimeout(gameCycle);
    }

    return () => {
      clearTimeout(gameCycle);
    };
  }, [gameState]);

  return (
    <>
      {gameState.gameOver && <GameOver />}
      <Score score={gameState.gameScore} isMaxScoreReached={gameState.isMaxScoreReached} />
      <GameBoard
        gameBoardRows={GAME_BOARD_ROWS}
        gameBoardColumns={GAME_BOARD_COLUMNS}
        totalCellAmount={GAME_BOARD_TOTAL_CELLS}
        foodCellIndex={gameState.foodCellIndex}
        isMaxScoreReached={gameState.isMaxScoreReached}
        snakeBodyIndexes={convertSnakeBodyCordsToZeroBasedIndexes(gameState.snakeBodyCords)}
      />
    </>
  );
}

export default GameLogic;
