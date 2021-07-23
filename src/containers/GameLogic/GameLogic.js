import React, { useEffect, useReducer } from 'react';

import GameBoard from '../../components/GameBoard/GameBoard';
import GameOver from '../../components/GameOver/GameOver';
import Score from '../../components/Score/Score';
import {
  generateNotOccupiedCellIndex,
  snakeBodyPartsIndexesZeroBased,
  calcSnakeBodyPartIndexZeroBased,
} from './utils';

const GAME_BOARD_ROWS = 3;
const GAME_BOARD_COLUMNS = 3;
const GAME_STEP_INTERVAL = 500; // milliseconds
const TOTAL_CELL_AMOUNT = GAME_BOARD_ROWS * GAME_BOARD_COLUMNS;

const initialState = {
  snakeBodyCords: [
    { row: 2, column: 2, direction: 'UP' },
    { row: 3, column: 2, direction: 'UP' },
    // { row: 3, column: 6, direction: 'UP' },
    // { row: 4, column: 6, direction: 'UP' },
    // { row: 5, column: 6, direction: 'UP' },
    // { row: 6, column: 6, direction: 'UP' },
    // { row: 7, column: 6, direction: 'UP' },
    // { row: 8, column: 6, direction: 'UP' },
    // { row: 9, column: 6, direction: 'UP' },
  ], // [{row: Number, column: Number, direction: enum(UP, DOWN, LEFT, RIGHT)}, ...]
  snakeHeadDirection: 'UP', // enum(UP, DOWN, LEFT, RIGHT)
  gameScore: 0,
  foodCellIndex: null,
  gameOver: false,
  isMaxScoreReached: false,
};

const gameControlReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FOOD_CELL_INDEX':
      return { ...state, foodCellIndex: action.foodCellIndex };
    case 'GO_UP':
      return snakeGoUp(state);
    case 'GO_DOWN':
      return snakeGoDown(state);
    case 'GO_LEFT':
      return snakeGoLeft(state);
    case 'GO_RIGHT':
      return snakeGoRight(state);
    case 'SNAKE_MOVE':
      return moveSnakeBodyPartsAccordingTheirDirection(state);
    default:
      throw new Error('Unknown action type provided!');
  }
};

const isSnakeHitTheWall = (snakeHeadCords) => {
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

const isSnakeOverlapItsOwnBody = (snakeBodyCords, snakeHeadCords) => {
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
    isSnakeHitTheWall(snakeHeadCords) ||
    isSnakeOverlapItsOwnBody(snakeBodyCords, snakeHeadCords)
  ) {
    console.log('game over');
    return true;
  }

  return false;
};

const isSnakeHeadOnFoodCell = (snakeHeadCords, foodCellIndex) => {
  const snakeHeadCordsAsGameBoardCellIndex = calcSnakeBodyPartIndexZeroBased(
    snakeHeadCords.row,
    snakeHeadCords.column,
    GAME_BOARD_COLUMNS
  );

  if (snakeHeadCordsAsGameBoardCellIndex === foodCellIndex) {
    return true;
  }

  return false;
};

const updateGameStateSnakeHeadOnFoodCell = (gameState, snakeBodyCords, snakeBodyCordsUpdated) => {
  const snakeBodyNewCords = [snakeBodyCordsUpdated[0], ...snakeBodyCords];

  if (snakeBodyNewCords.length < GAME_BOARD_ROWS * GAME_BOARD_COLUMNS) {
    let foodCellIndex;
    foodCellIndex = generateNotOccupiedCellIndex(
      snakeBodyNewCords,
      TOTAL_CELL_AMOUNT,
      GAME_BOARD_COLUMNS
    );

    return {
      ...gameState,
      snakeBodyCords: snakeBodyNewCords,
      foodCellIndex: foodCellIndex,
      gameScore: gameState.gameScore + 1,
    };
  }

  return gameState;
};

const moveSnakeBodyPartsAccordingTheirDirection = (gameState) => {
  const snakeBodyCordsUpdated = [];
  const snakeBodyCords = gameState.snakeBodyCords;

  console.log(gameState);

  const updateSnakeBodyCords = (previousPartDirection, row, column) => {
    snakeBodyCordsUpdated.push({ direction: previousPartDirection, row, column });
  };

  let prevPartDirection;
  for (let section = 0; section < snakeBodyCords.length; section++) {
    const { row, column, direction } = snakeBodyCords[section];

    if (section > 0) {
      prevPartDirection = snakeBodyCords[section - 1].direction;
    } else {
      prevPartDirection = gameState.snakeHeadDirection;
    }

    if (direction === 'UP') {
      updateSnakeBodyCords(prevPartDirection, row - 1, column);
    } else if (direction === 'DOWN') {
      updateSnakeBodyCords(prevPartDirection, row + 1, column);
    } else if (direction === 'LEFT') {
      updateSnakeBodyCords(prevPartDirection, row, column - 1);
    } else if (direction === 'RIGHT') {
      updateSnakeBodyCords(prevPartDirection, row, column + 1);
    }
  }

  if (isMaxScoreReached(snakeBodyCordsUpdated, gameState.foodCellIndex)) {
    return { ...gameState, isMaxScoreReached: true, gameScore: gameState.gameScore + 1 };
  }

  if (isGameOver(snakeBodyCordsUpdated)) return { ...gameState, gameOver: true };

  if (isSnakeHeadOnFoodCell(snakeBodyCordsUpdated[0], gameState.foodCellIndex)) {
    return updateGameStateSnakeHeadOnFoodCell(gameState, snakeBodyCords, snakeBodyCordsUpdated);
  }

  return { ...gameState, snakeBodyCords: snakeBodyCordsUpdated };
};

const updateSnakeHeadDirectionData = (gameState, changedDirection) => {
  const updatedSnakeBodyCords = [...gameState.snakeBodyCords];
  updatedSnakeBodyCords[0] = { ...updatedSnakeBodyCords[0], direction: changedDirection };
  return {
    ...gameState,
    snakeBodyCords: updatedSnakeBodyCords,
    snakeHeadDirection: changedDirection,
  };
};

const snakeGoUp = (gameState) => {
  return updateSnakeHeadDirectionData(gameState, 'UP');
};

const snakeGoDown = (gameState) => {
  return updateSnakeHeadDirectionData(gameState, 'DOWN');
};

const snakeGoLeft = (gameState) => {
  return updateSnakeHeadDirectionData(gameState, 'LEFT');
};

const snakeGoRight = (gameState) => {
  return updateSnakeHeadDirectionData(gameState, 'RIGHT');
};

const isMaxScoreReached = (snakeBodyCords, foodCellIndex) => {
  const snakeHeadCords = snakeBodyCords[0];
  if (snakeBodyCords.length === GAME_BOARD_ROWS * GAME_BOARD_COLUMNS - 1) {
    const snakeHeadCordsAsGameBoardCellIndex = calcSnakeBodyPartIndexZeroBased(
      snakeHeadCords.row,
      snakeHeadCords.column,
      GAME_BOARD_COLUMNS
    );
    if (snakeHeadCordsAsGameBoardCellIndex === foodCellIndex) {
      return true;
    }
  }
  return false;
};

const generateFoodCellIndexAndDispatchAction = (gameState, dispatch) => {
  const foodCellIndex = generateNotOccupiedCellIndex(
    gameState.snakeBodyCords,
    TOTAL_CELL_AMOUNT,
    GAME_BOARD_COLUMNS
  );
  dispatch({ type: 'SET_FOOD_CELL_INDEX', foodCellIndex: foodCellIndex });
};

function GameLogic() {
  const [gameState, dispatch] = useReducer(gameControlReducer, initialState);

  useEffect(() => {
    generateFoodCellIndexAndDispatchAction(gameState, dispatch);
  }, []);

  useEffect(() => {
    const snakeMoveInterval = setInterval(() => {
      dispatch({ type: 'SNAKE_MOVE' });
    }, GAME_STEP_INTERVAL);

    if (gameState.gameOver || gameState.isMaxScoreReached) {
      clearInterval(snakeMoveInterval);
    }

    return () => {
      clearInterval(snakeMoveInterval);
    };
  }, [gameState]);

  useEffect(() => {
    const gameControlKeyPressHandler = (event) => {
      const { key } = event;
      const direction = gameState.snakeHeadDirection;
      switch (key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') dispatch({ type: 'GO_UP' });
          break;
        case 'ArrowDown':
          if (direction !== 'UP') dispatch({ type: 'GO_DOWN' });
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') dispatch({ type: 'GO_LEFT' });
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') dispatch({ type: 'GO_RIGHT' });
          break;
        default:
      }
    };

    document.addEventListener('keydown', gameControlKeyPressHandler);

    return () => {
      document.removeEventListener('keydown', gameControlKeyPressHandler);
    };
  }, [gameState]);

  return (
    <>
      {gameState.gameOver && <GameOver />}
      <Score score={gameState.gameScore} isMaxScoreReached={gameState.isMaxScoreReached} />
      <GameBoard
        cellRowAmount={GAME_BOARD_ROWS}
        cellColumnAmount={GAME_BOARD_COLUMNS}
        foodCellIndex={gameState.foodCellIndex}
        snakeBodyCords={snakeBodyPartsIndexesZeroBased(
          gameState.snakeBodyCords,
          GAME_BOARD_COLUMNS
        )}
      />
    </>
  );
}

export default GameLogic;
