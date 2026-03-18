import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contact } from './contact';

describe('ContactSection', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the contact form and shared channels', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('form')).toBeTruthy();
    expect(element.querySelectorAll('a.soft-card').length).toBe(4);
    expect(element.textContent).toContain('Costruiamo qualcosa insieme.');
  });
});
