import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Experimental } from './experimental';

describe('Experimental', () => {
  let component: Experimental;
  let fixture: ComponentFixture<Experimental>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Experimental],
    }).compileComponents();

    fixture = TestBed.createComponent(Experimental);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
