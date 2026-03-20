import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Background } from './background';

describe('Background', () => {
  let component: Background;
  let fixture: ComponentFixture<Background>;
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  beforeAll(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: () => null,
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Background],
    }).compileComponents();

    fixture = TestBed.createComponent(Background);
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
