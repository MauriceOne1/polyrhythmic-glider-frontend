import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import {
  DEFAULT_SNAKE_CONFIG,
  advanceGame,
  createInitialState,
  setDirection,
  startGame,
  togglePause,
} from './snake-game';
import type { Direction, SnakeCell, SnakeGameState } from './snake-game';

type BoardCellKind = 'empty' | 'snake-head' | 'snake-body' | 'food';

interface BoardCellViewModel {
  id: string;
  kind: BoardCellKind;
}

@Component({
  selector: 'app-snake',
  imports: [],
  templateUrl: './snake.html',
  styleUrl: './snake.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Snake implements OnInit, OnDestroy {
  readonly boardRows = DEFAULT_SNAKE_CONFIG.rows;
  readonly boardColumns = DEFAULT_SNAKE_CONFIG.columns;
  readonly state = signal(this.buildInitialState());
  readonly boardCells = computed(() => this.createBoardCells(this.state()));
  readonly statusLabel = computed(() => this.getStatusLabel(this.state()));
  readonly liveAnnouncement = computed(() => {
    const state = this.state();
    return `Stato ${this.getStatusLabel(state)}. Punteggio ${state.score}.`;
  });
  readonly primaryActionLabel = computed(() => {
    const status = this.state().status;

    if (status === 'game-over') {
      return 'Restart';
    }

    if (status === 'paused') {
      return 'Resume';
    }

    if (status === 'running') {
      return 'Pause';
    }

    return 'Start';
  });

  private intervalId: number | null = null;

  ngOnInit(): void {
    this.intervalId = window.setInterval(() => {
      this.state.update((currentState) => advanceGame(currentState));
    }, 150);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    const direction = this.getDirectionFromKey(event.key);

    if (direction) {
      event.preventDefault();
      this.queueDirection(direction);
      return;
    }

    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.togglePausedState();
      return;
    }

    if (event.key.toLowerCase() === 'r') {
      event.preventDefault();
      this.restart();
    }
  }

  queueDirection(direction: Direction): void {
    this.state.update((currentState) => {
      if (currentState.status === 'game-over') {
        return currentState;
      }

      return setDirection(startGame(currentState), direction);
    });
  }

  togglePausedState(): void {
    this.state.update((currentState) => togglePause(currentState));
  }

  restart(): void {
    this.state.set(this.buildInitialState());
  }

  handlePrimaryAction(): void {
    if (this.state().status === 'game-over') {
      this.restart();
      return;
    }

    this.togglePausedState();
  }

  private buildInitialState(): SnakeGameState {
    return createInitialState(DEFAULT_SNAKE_CONFIG);
  }

  private getDirectionFromKey(key: string): Direction | null {
    switch (key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        return 'up';
      case 'arrowdown':
      case 's':
        return 'down';
      case 'arrowleft':
      case 'a':
        return 'left';
      case 'arrowright':
      case 'd':
        return 'right';
      default:
        return null;
    }
  }

  private createBoardCells(state: SnakeGameState): BoardCellViewModel[] {
    const snakeCells = new Map<string, BoardCellKind>();

    state.snake.forEach((segment, index) => {
      snakeCells.set(
        this.toCellKey(segment),
        index === 0 ? 'snake-head' : 'snake-body'
      );
    });

    const foodCell = state.food ? this.toCellKey(state.food) : null;
    const cells: BoardCellViewModel[] = [];

    for (let row = 0; row < state.board.rows; row++) {
      for (let column = 0; column < state.board.columns; column++) {
        const key = this.toCellKey({ row, column });
        let kind: BoardCellKind = 'empty';

        if (snakeCells.has(key)) {
          kind = snakeCells.get(key) ?? 'empty';
        } else if (foodCell === key) {
          kind = 'food';
        }

        cells.push({
          id: key,
          kind,
        });
      }
    }

    return cells;
  }

  private getStatusLabel(state: SnakeGameState): string {
    if (state.status === 'ready') {
      return 'Ready';
    }

    if (state.status === 'paused') {
      return 'Paused';
    }

    if (state.status === 'game-over') {
      return state.food === null ? 'Board cleared' : 'Game over';
    }

    return 'Running';
  }

  private toCellKey(cell: SnakeCell): string {
    return `${cell.row}:${cell.column}`;
  }
}
