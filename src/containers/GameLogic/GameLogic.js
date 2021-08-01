import React, { useEffect, useReducer, useState, useCallback } from 'react';

import GameBoard from '../../components/GameBoard/GameBoard';
import GameOver from '../../components/GameOver/GameOver';
import RestartGame from '../../components/RestartGame/RestartGame';
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
  restartGame: {}, // object is used to easily change reference
};

const gameControlReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_FOOD_CELL_INITIAL_INDEX':
      return setFoodCellIndexInitialState(state);
    case 'CHANGE_SNAKE_HEAD_DIRECTION':
      return updateSnakeHeadDirectionState(state, payload);
    case 'RUN_GAME_LOGIC':
      return runGameLogic(state);
    case 'RESTART_GAME':
      return restartGame();
    default:
      throw new Error('Unknown action type provided!');
  }
};

const restartGame = () => {
  return { ...gameInitialState, restartGame: {} }; // changing object reference for restartGame to cause state update
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

const calcSnakeBodyPartIndexZeroBased = (cords) => {
  const { row, column } = cords;
  const index = (row - 1) * GAME_BOARD_COLUMNS + column;
  return index - 1;
};

const isFoodCellIndexMatchingWithSnakeBodyCords = (snakeBodyCords, foodCellIndex) => {
  return snakeBodyCords.some((bodyPartCords) => {
    const snakeBodyPartIndex = calcSnakeBodyPartIndexZeroBased(bodyPartCords);

    return snakeBodyPartIndex === foodCellIndex;
  });
};

const generateNotOccupiedCellIndex = (snakeBodyCords) => {
  let randomFoodCellIndex = generateRandomFoodCellIndex();

  while (isFoodCellIndexMatchingWithSnakeBodyCords(snakeBodyCords, randomFoodCellIndex)) {
    console.log('random index cell regenerate'); // logged because potential infinite loop logic is implemented
    randomFoodCellIndex = generateRandomFoodCellIndex();
  }

  return randomFoodCellIndex;
};

const convertSnakeBodyCordsToZeroBasedIndexes = (snakeBodyCords) => {
  return snakeBodyCords.map((snakeBodyPartCords) =>
    calcSnakeBodyPartIndexZeroBased(snakeBodyPartCords)
  );
};

const isSnakeHeadHitTheWall = (snakeHeadCords) => {
  const { row, column } = snakeHeadCords;

  return (
    row === 0 || row === GAME_BOARD_ROWS + 1 || column === 0 || column === GAME_BOARD_COLUMNS + 1
  );
};

const isSnakeHeadOverlapItsOwnBody = (snakeBodyCords, snakeHeadCords) => {
  for (
    let snakeBodyPartIndex = 1;
    snakeBodyPartIndex < snakeBodyCords.length;
    snakeBodyPartIndex++
  ) {
    if (
      calcSnakeBodyPartIndexZeroBased(snakeBodyCords[snakeBodyPartIndex]) ===
      calcSnakeBodyPartIndexZeroBased(snakeHeadCords)
    ) {
      return true;
    }
  }
};

const isGameOver = (snakeBodyCords) => {
  const snakeHeadCords = snakeBodyCords[0];
  return (
    isSnakeHeadHitTheWall(snakeHeadCords) ||
    isSnakeHeadOverlapItsOwnBody(snakeBodyCords, snakeHeadCords)
  );
};

const isSnakeHeadIndexMatchWithFoodCellIndex = (snakeHeadCords, foodCellIndex) => {
  const snakeHeadIndex = calcSnakeBodyPartIndexZeroBased(snakeHeadCords);

  return snakeHeadIndex === foodCellIndex;
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
    const snakeHeadIndex = calcSnakeBodyPartIndexZeroBased(snakeHeadCords);
    if (snakeHeadIndex === foodCellIndex) {
      return true;
    }
  }
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

    switch (direction) {
      case 'UP':
        updateSnakeBodyPartDirection(prevPartDirection, row - 1, column);
        break;
      case 'DOWN':
        updateSnakeBodyPartDirection(prevPartDirection, row + 1, column);
        break;
      case 'LEFT':
        updateSnakeBodyPartDirection(prevPartDirection, row, column - 1);
        break;
      case 'RIGHT':
        updateSnakeBodyPartDirection(prevPartDirection, row, column + 1);
        break;
      default:
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

const restartGameHandler = (dispatch) => {
  dispatch({ type: 'RESTART_GAME' });
};

const GameLogic = () => {
  const [gameState, dispatch] = useReducer(gameControlReducer, gameInitialState);
  const [gameCycleIntervalId, setGameCycleIntervalId] = useState(null);

  const {
    snakeBodyCords,
    snakeHeadDirection,
    gameScore,
    foodCellIndex,
    gameOver,
    isMaxScoreReached,
    restartGame,
  } = gameState;

  const gameControlKeyDownHandler = useCallback(
    (event) => {
      const isCurrentDirectionUpOrDown =
        snakeHeadDirection === 'UP' || snakeHeadDirection === 'DOWN';
      const isCurrentDirectionLeftOrRight =
        snakeHeadDirection === 'LEFT' || snakeHeadDirection === 'RIGHT';

      switch (event.key) {
        case 'ArrowUp':
          if (isCurrentDirectionLeftOrRight)
            dispatch({ type: 'CHANGE_SNAKE_HEAD_DIRECTION', payload: 'UP' });
          break;
        case 'ArrowDown':
          if (isCurrentDirectionLeftOrRight)
            dispatch({ type: 'CHANGE_SNAKE_HEAD_DIRECTION', payload: 'DOWN' });
          break;
        case 'ArrowLeft':
          if (isCurrentDirectionUpOrDown)
            dispatch({ type: 'CHANGE_SNAKE_HEAD_DIRECTION', payload: 'LEFT' });
          break;
        case 'ArrowRight':
          if (isCurrentDirectionUpOrDown)
            dispatch({ type: 'CHANGE_SNAKE_HEAD_DIRECTION', payload: 'RIGHT' });
          break;
        default:
      }
    },
    [snakeHeadDirection]
  );

  useEffect(() => {
    dispatch({ type: 'SET_FOOD_CELL_INITIAL_INDEX' });

    const gameCycle = setInterval(() => {
      dispatch({ type: 'RUN_GAME_LOGIC' });
    }, GAME_STEP_INTERVAL);

    setGameCycleIntervalId(gameCycle);

    return () => clearInterval(gameCycle);
  }, [restartGame]);

  useEffect(() => {
    if (gameOver || isMaxScoreReached) {
      clearInterval(gameCycleIntervalId);
    }

    document.addEventListener('keydown', gameControlKeyDownHandler, { once: true });

    return () => document.removeEventListener('keydown', gameControlKeyDownHandler, { once: true });
  }, [snakeBodyCords]);

  return (
    <>
      {gameOver && <GameOver />}
      <Score score={gameScore} isMaxScoreReached={isMaxScoreReached} />
      {gameOver && <RestartGame restartHandler={() => restartGameHandler(dispatch)} />}
      <GameBoard
        gameBoardRows={GAME_BOARD_ROWS}
        gameBoardColumns={GAME_BOARD_COLUMNS}
        totalCellAmount={GAME_BOARD_TOTAL_CELLS}
        foodCellIndex={foodCellIndex}
        isMaxScoreReached={isMaxScoreReached}
        snakeBodyIndexes={convertSnakeBodyCordsToZeroBasedIndexes(snakeBodyCords)}
      />
    </>
  );
};

export default GameLogic;
