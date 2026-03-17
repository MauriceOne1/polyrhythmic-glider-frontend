export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus = 'ready' | 'running' | 'paused' | 'game-over';

export interface SnakeCell {
  row: number;
  column: number;
}

export interface SnakeBoard {
  rows: number;
  columns: number;
}

export interface SnakeGameConfig extends SnakeBoard {
  initialLength: number;
}

export interface SnakeGameState {
  board: SnakeBoard;
  snake: SnakeCell[];
  direction: Direction;
  pendingDirection: Direction;
  food: SnakeCell | null;
  score: number;
  status: GameStatus;
}

export const DEFAULT_SNAKE_CONFIG: SnakeGameConfig = {
  rows: 16,
  columns: 16,
  initialLength: 3,
};

const DIRECTION_VECTORS: Record<Direction, SnakeCell> = {
  up: { row: -1, column: 0 },
  down: { row: 1, column: 0 },
  left: { row: 0, column: -1 },
  right: { row: 0, column: 1 },
};

const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function createInitialState(
  config: SnakeGameConfig = DEFAULT_SNAKE_CONFIG,
  randomNumber: () => number = Math.random
): SnakeGameState {
  const snake = createStartingSnake(config);

  return {
    board: {
      rows: config.rows,
      columns: config.columns,
    },
    snake,
    direction: 'right',
    pendingDirection: 'right',
    food: placeFood(
      {
        rows: config.rows,
        columns: config.columns,
      },
      snake,
      randomNumber
    ),
    score: 0,
    status: 'ready',
  };
}

export function startGame(state: SnakeGameState): SnakeGameState {
  if (state.status === 'game-over' || state.status === 'running') {
    return state;
  }

  return {
    ...state,
    status: 'running',
  };
}

export function togglePause(state: SnakeGameState): SnakeGameState {
  if (state.status === 'game-over') {
    return state;
  }

  if (state.status === 'running') {
    return {
      ...state,
      status: 'paused',
    };
  }

  return {
    ...state,
    status: 'running',
  };
}

export function setDirection(
  state: SnakeGameState,
  nextDirection: Direction
): SnakeGameState {
  if (OPPOSITE_DIRECTIONS[state.direction] === nextDirection) {
    return state;
  }

  return {
    ...state,
    pendingDirection: nextDirection,
  };
}

export function advanceGame(
  state: SnakeGameState,
  randomNumber: () => number = Math.random
): SnakeGameState {
  if (state.status !== 'running') {
    return state;
  }

  const nextDirection = state.pendingDirection;
  const nextHead = moveCell(state.snake[0], nextDirection);
  const willGrow = state.food !== null && cellsMatch(nextHead, state.food);
  const collisionSegments = willGrow ? state.snake : state.snake.slice(0, -1);

  if (
    isOutsideBoard(nextHead, state.board) ||
    collisionSegments.some((segment) => cellsMatch(segment, nextHead))
  ) {
    return {
      ...state,
      status: 'game-over',
    };
  }

  const nextSnake = [nextHead, ...state.snake];

  if (!willGrow) {
    nextSnake.pop();
  }

  const nextFood = willGrow
    ? placeFood(state.board, nextSnake, randomNumber)
    : state.food;

  return {
    ...state,
    snake: nextSnake,
    direction: nextDirection,
    pendingDirection: nextDirection,
    food: nextFood,
    score: willGrow ? state.score + 1 : state.score,
    status: willGrow && nextFood === null ? 'game-over' : 'running',
  };
}

export function placeFood(
  board: SnakeBoard,
  snake: SnakeCell[],
  randomNumber: () => number = Math.random
): SnakeCell | null {
  const occupied = new Set(snake.map((cell) => toCellKey(cell)));
  const availableCells: SnakeCell[] = [];

  for (let row = 0; row < board.rows; row++) {
    for (let column = 0; column < board.columns; column++) {
      const cell = { row, column };

      if (!occupied.has(toCellKey(cell))) {
        availableCells.push(cell);
      }
    }
  }

  if (availableCells.length === 0) {
    return null;
  }

  const index = Math.min(
    availableCells.length - 1,
    Math.floor(randomNumber() * availableCells.length)
  );

  return availableCells[index];
}

function createStartingSnake(config: SnakeGameConfig): SnakeCell[] {
  const centerRow = Math.floor(config.rows / 2);
  const headColumn = Math.max(
    config.initialLength - 1,
    Math.floor(config.columns / 2)
  );
  const snake: SnakeCell[] = [];

  for (let index = 0; index < config.initialLength; index++) {
    snake.push({
      row: centerRow,
      column: headColumn - index,
    });
  }

  return snake;
}

function moveCell(cell: SnakeCell, direction: Direction): SnakeCell {
  const vector = DIRECTION_VECTORS[direction];

  return {
    row: cell.row + vector.row,
    column: cell.column + vector.column,
  };
}

function isOutsideBoard(cell: SnakeCell, board: SnakeBoard): boolean {
  return (
    cell.row < 0 ||
    cell.row >= board.rows ||
    cell.column < 0 ||
    cell.column >= board.columns
  );
}

function cellsMatch(first: SnakeCell, second: SnakeCell): boolean {
  return first.row === second.row && first.column === second.column;
}

function toCellKey(cell: SnakeCell): string {
  return `${cell.row}:${cell.column}`;
}
