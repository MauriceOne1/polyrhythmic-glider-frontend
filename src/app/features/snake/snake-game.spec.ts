import {
  advanceGame,
  createInitialState,
  placeFood,
  setDirection,
  startGame,
} from './snake-game';
import type { SnakeGameState } from './snake-game';

describe('snake-game', () => {
  it('creates a starting board with food outside the snake', () => {
    const state = createInitialState(
      {
        rows: 6,
        columns: 6,
        initialLength: 3,
      },
      () => 0
    );

    expect(state.snake).toEqual([
      { row: 3, column: 3 },
      { row: 3, column: 2 },
      { row: 3, column: 1 },
    ]);
    expect(state.food).toEqual({ row: 0, column: 0 });
  });

  it('moves the snake forward one cell on each tick', () => {
    const nextState = advanceGame(startGame(createInitialState()), () => 0);

    expect(nextState.snake[0]).toEqual({ row: 8, column: 9 });
    expect(nextState.snake).toHaveLength(3);
    expect(nextState.score).toBe(0);
  });

  it('ignores reversing direction into the snake body', () => {
    const initialState = startGame(createInitialState());
    const reversedState = setDirection(initialState, 'left');
    const nextState = advanceGame(reversedState, () => 0);

    expect(nextState.direction).toBe('right');
    expect(nextState.snake[0]).toEqual({ row: 8, column: 9 });
  });

  it('grows the snake and increments score when it eats food', () => {
    const state = startGame(createInitialState());
    const stateWithFood: SnakeGameState = {
      ...state,
      food: { row: 8, column: 9 },
    };

    const nextState = advanceGame(stateWithFood, () => 0);

    expect(nextState.snake).toHaveLength(4);
    expect(nextState.score).toBe(1);
    expect(nextState.food).not.toEqual({ row: 8, column: 9 });
  });

  it('ends the game when the snake hits a wall', () => {
    const state: SnakeGameState = {
      board: { rows: 4, columns: 4 },
      snake: [
        { row: 1, column: 3 },
        { row: 1, column: 2 },
        { row: 1, column: 1 },
      ],
      direction: 'right',
      pendingDirection: 'right',
      food: { row: 0, column: 0 },
      score: 0,
      status: 'running',
    };

    const nextState = advanceGame(state, () => 0);

    expect(nextState.status).toBe('game-over');
  });

  it('ends the game when the snake runs into itself', () => {
    const state: SnakeGameState = {
      board: { rows: 6, columns: 6 },
      snake: [
        { row: 2, column: 2 },
        { row: 2, column: 1 },
        { row: 3, column: 1 },
        { row: 3, column: 2 },
        { row: 3, column: 3 },
        { row: 2, column: 3 },
      ],
      direction: 'up',
      pendingDirection: 'left',
      food: { row: 0, column: 0 },
      score: 4,
      status: 'running',
    };

    const nextState = advanceGame(state, () => 0);

    expect(nextState.status).toBe('game-over');
  });

  it('places food only on open cells', () => {
    const food = placeFood(
      { rows: 2, columns: 2 },
      [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 0 },
      ],
      () => 0
    );

    expect(food).toEqual({ row: 1, column: 1 });
  });
});
