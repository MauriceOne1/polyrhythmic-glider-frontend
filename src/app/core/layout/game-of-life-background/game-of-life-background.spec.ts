import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOfLifeBackground } from './game-of-life-background';

describe('GameOfLifeBackground', () => {
  let component: GameOfLifeBackground;
  let fixture: ComponentFixture<GameOfLifeBackground>;
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  beforeAll(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: () => null,
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOfLifeBackground],
    }).compileComponents();

    fixture = TestBed.createComponent(GameOfLifeBackground);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: originalGetContext,
    });
  });
});
