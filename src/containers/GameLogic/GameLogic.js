import React, { useState, useEffect, useReducer } from 'react';

import GameBoard from '../../components/GameBoard/GameBoard';
import {
  generateNotOccupiedCellIndex,
  gameControlKeyPressHandler,
  snakeBodyPartsIndexesZeroBased,
} from './utils';

const GAME_BOARD_ROWS = 6;
const GAME_BOARD_COLUMNS = 7;
const GAME_STEP_INTERVAL = 500; // milliseconds
const TOTAL_CELL_AMOUNT = GAME_BOARD_ROWS * GAME_BOARD_COLUMNS;

const initialState = {
  snakeBodyCords: [
    { row: 3, column: 4 },
    { row: 4, column: 4 },
  ], // [{row: Number, column: Number}, ...]
  snakeTurnPoints: [], // [{row: Number, column: Number, direction: enum(up, down, left, right)}, ...]
  snakeMoveDirection: 'up', // enum(up, down, left, right)
  gameScore: 0,
  foodCellIndex: null,
  gameLost: false,
};

const gameControlReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FOOD_CELL_INDEX':
      return { ...state, foodCellIndex: action.payload };
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      return '';
    default:
      throw new Error('Unknown action type provided!');
  }
};

function GameLogic() {
  const [gameState, dispatch] = useReducer(gameControlReducer, initialState);

  useEffect(() => {
    const foodCellIndex = generateNotOccupiedCellIndex(
      gameState.snakeBodyCords,
      TOTAL_CELL_AMOUNT,
      GAME_BOARD_COLUMNS
    );
    dispatch({ type: 'SET_FOOD_CELL_INDEX', payload: foodCellIndex });
    console.log(foodCellIndex);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', gameControlKeyPressHandler);

    return () => {
      document.removeEventListener('keydown', gameControlKeyPressHandler);
    };
  }, []);

  // useEffect(() => {
  //   const gameStepIntervalId = setInterval(() => {
  //     const foodCellIndex = generateRandomFoodCellIndex();
  //     setFoodCellIndex(foodCellIndex);
  //   }, GAME_STEP_INTERVAL);

  //   return () => {
  //     clearInterval(gameStepIntervalId);
  //   };
  // }, []);

  return (
    <GameBoard
      cellRowAmount={GAME_BOARD_ROWS}
      cellColumnAmount={GAME_BOARD_COLUMNS}
      foodCellIndex={gameState.foodCellIndex}
      snakeBodyCords={snakeBodyPartsIndexesZeroBased(gameState.snakeBodyCords, GAME_BOARD_COLUMNS)}
    />
  );
}

export default GameLogic;
