import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ContactTestService } from './contact-test.service';

describe('ContactTestService', () => {
  let service: ContactTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactTestService);
  });

  it('stores the latest simulated contact submission', fakeAsync(() => {
    let replyWindow = '';

    service
      .submit({
        name: 'Maurice',
        email: 'maurice@example.com',
        subject: 'creative-coding',
        message: 'Vorrei parlare di una installazione audiovisiva condivisa.',
        consent: true,
      })
      .subscribe((result) => {
        replyWindow = result.estimatedReplyWindow;
      });

    tick(650);

    expect(replyWindow).toBe('entro 3 giorni lavorativi');
    expect(service.latestSubmission()?.email).toBe('maurice@example.com');
    expect(service.submissions().length).toBe(1);
  }));
});
