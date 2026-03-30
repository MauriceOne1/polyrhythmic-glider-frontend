import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-game-of-life-background',
  templateUrl: './game-of-life-background.html',
  styleUrl: './game-of-life-background.css',
})
export class GameOfLifeBackground implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;
  private resizeHandler = () => this.setupWorld();

  private columns = 0;
  private rows = 0;
  private cellSize = 14;
  private grid = new Uint8Array(0);
  private nextGrid = new Uint8Array(0);
  private generation = 0;
  private liveCells = 0;
  private lastTimestamp = 0;
  private accumulator = 0;

  private readonly stepInterval = 110;
  private readonly reseedThreshold = 0.035;

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    this.ctx = ctx;
    this.setupWorld();
    window.addEventListener('resize', this.resizeHandler);
    this.animationId = requestAnimationFrame(this.animate);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    cancelAnimationFrame(this.animationId);
  }

  private setupWorld(): void {
    const canvas = this.canvas.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    this.cellSize = width < 640 ? 11 : width < 1100 ? 13 : 15;
    this.columns = Math.max(28, Math.ceil(width / this.cellSize));
    this.rows = Math.max(22, Math.ceil(height / this.cellSize));

    const totalCells = this.columns * this.rows;
    this.grid = new Uint8Array(totalCells);
    this.nextGrid = new Uint8Array(totalCells);
    this.accumulator = 0;
    this.lastTimestamp = 0;

    this.seedWorld();
    this.render();
  }

  private seedWorld(): void {
    this.grid.fill(0);
    this.nextGrid.fill(0);
    this.generation = 0;

    const randomDensity = window.innerWidth < 640 ? 0.2 : 0.18;

    for (let index = 0; index < this.grid.length; index++) {
      this.grid[index] = Math.random() < randomDensity ? 1 : 0;
    }

    this.injectGlider(
      Math.floor(this.columns * 0.2),
      Math.floor(this.rows * 0.2)
    );
    this.injectGlider(
      Math.floor(this.columns * 0.72),
      Math.floor(this.rows * 0.28),
      true
    );
    this.injectGlider(
      Math.floor(this.columns * 0.34),
      Math.floor(this.rows * 0.66)
    );
    this.injectGlider(
      Math.floor(this.columns * 0.8),
      Math.floor(this.rows * 0.72),
      true
    );
    this.liveCells = this.countAlive(this.grid);
  }

  private injectGlider(
    column: number,
    row: number,
    flipHorizontally = false
  ): void {
    const pattern = flipHorizontally
      ? [
          [0, 1],
          [1, 2],
          [2, 0],
          [2, 1],
          [2, 2],
        ]
      : [
          [0, 2],
          [1, 0],
          [1, 2],
          [2, 1],
          [2, 2],
        ];

    for (const [rowOffset, columnOffset] of pattern) {
      const targetColumn =
        (column + columnOffset + this.columns) % this.columns;
      const targetRow = (row + rowOffset + this.rows) % this.rows;
      this.grid[this.toIndex(targetColumn, targetRow)] = 1;
    }
  }

  private animate = (timestamp: number): void => {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }

    const frameDelta = Math.min(timestamp - this.lastTimestamp, 250);
    this.lastTimestamp = timestamp;
    this.accumulator += frameDelta;

    while (this.accumulator >= this.stepInterval) {
      this.updateWorld();
      this.accumulator -= this.stepInterval;
    }

    this.render();
    this.animationId = requestAnimationFrame(this.animate);
  };

  private updateWorld(): void {
    let liveCount = 0;

    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        const index = this.toIndex(column, row);
        const isAlive = this.grid[index] === 1;
        const neighbours = this.countNeighbours(column, row);
        const survives = neighbours === 3 || (isAlive && neighbours === 2);
        const nextValue = survives ? 1 : 0;

        this.nextGrid[index] = nextValue;
        liveCount += nextValue;
      }
    }

    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
    this.liveCells = liveCount;
    this.generation += 1;

    const liveRatio = this.liveCells / this.grid.length;

    if (liveRatio < this.reseedThreshold || liveRatio > 0.52) {
      this.seedWorld();
      return;
    }

    if (this.generation % 24 === 0) {
      this.sprinkleVariation();
    }
  }

  private sprinkleVariation(): void {
    const mutations = Math.max(8, Math.floor(this.grid.length * 0.012));

    for (let index = 0; index < mutations; index++) {
      const cellIndex = Math.floor(Math.random() * this.grid.length);
      this.grid[cellIndex] = Math.random() > 0.45 ? 1 : 0;
    }

    this.liveCells = this.countAlive(this.grid);
  }

  private render(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const hueShift = (this.generation * 0.75) % 360;

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = 'rgba(5, 9, 18, 0.32)';
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.strokeStyle = 'rgba(122, 238, 216, 0.05)';
    this.ctx.lineWidth = 1;

    for (let column = 0; column <= this.columns; column++) {
      const x = column * this.cellSize + 0.5;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    for (let row = 0; row <= this.rows; row++) {
      const y = row * this.cellSize + 0.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    this.ctx.shadowBlur = 14;
    this.ctx.shadowColor = `hsla(${160 + hueShift * 0.08}, 100%, 72%, 0.35)`;

    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (this.grid[this.toIndex(column, row)] === 0) {
          continue;
        }

        const x = column * this.cellSize;
        const y = row * this.cellSize;
        const intensity =
          0.5 + ((column * 7 + row * 13 + this.generation) % 20) / 40;

        this.ctx.fillStyle = `hsla(${155 + hueShift * 0.12 + ((row + column) % 9)}, 100%, ${66 + intensity * 10}%, ${0.55 + intensity * 0.22})`;
        this.ctx.fillRect(
          x + 1.2,
          y + 1.2,
          Math.max(2, this.cellSize - 2.4),
          Math.max(2, this.cellSize - 2.4)
        );
      }
    }

    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    this.ctx.font = "600 12px 'Segoe UI', sans-serif";
    this.ctx.textAlign = 'right';
    this.ctx.fillText(
      `Generation ${this.generation} - Live ${this.liveCells}`,
      width - 18,
      height - 20
    );
  }

  private countNeighbours(column: number, row: number): number {
    let neighbours = 0;

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
        if (rowOffset === 0 && columnOffset === 0) {
          continue;
        }

        const targetColumn =
          (column + columnOffset + this.columns) % this.columns;
        const targetRow = (row + rowOffset + this.rows) % this.rows;
        neighbours += this.grid[this.toIndex(targetColumn, targetRow)];
      }
    }

    return neighbours;
  }

  private countAlive(grid: Uint8Array): number {
    let count = 0;

    for (let index = 0; index < grid.length; index++) {
      count += grid[index];
    }

    return count;
  }

  private toIndex(column: number, row: number): number {
    return row * this.columns + column;
  }
}
