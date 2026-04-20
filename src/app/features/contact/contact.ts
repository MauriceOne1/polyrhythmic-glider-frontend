import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContactForm } from '../../shared/components/contact-form/contact-form';
import { SectionShell } from '../../shared/components/section-shell/section-shell';
import { ReadableKeyPipe } from '../../shared/pipes/readable-key.pipe';
import { CONTACT_CHANNELS, HERO_TAGS } from '../../shared/utils/site-content';

@Component({
  selector: 'app-contact',
  imports: [ContactForm, FontAwesomeModule, ReadableKeyPipe, SectionShell],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  readonly channels = CONTACT_CHANNELS;
  readonly areas = HERO_TAGS;
}
