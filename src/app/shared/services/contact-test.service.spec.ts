import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ContactTestService } from './contact-test.service';

describe('ContactTestService', () => {
  let service: ContactTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactTestService);
  });

  it('stores the latest simulated contact submission', async () => {
    const result = await firstValueFrom(
      service.submit({
        name: 'Maurice',
        email: 'maurice@example.com',
        subject: 'creative-coding',
        message: 'Vorrei parlare di una installazione audiovisiva condivisa.',
        consent: true,
      })
    );

    expect(result.estimatedReplyWindow).toBe('entro 3 giorni lavorativi');
    expect(service.latestSubmission()?.email).toBe('maurice@example.com');
    expect(service.submissions().length).toBe(1);
  });
});
