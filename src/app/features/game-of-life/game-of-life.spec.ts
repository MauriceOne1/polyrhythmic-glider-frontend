import { TestBed } from '@angular/core/testing';

import { GameOfLife } from './game-of-life';

describe('GameOfLife', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOfLife],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(GameOfLife);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
