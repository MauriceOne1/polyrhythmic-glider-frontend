import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionShell } from '../../shared/components/section-shell/section-shell';
import { ABOUT_MANIFESTO_CARDS, ABOUT_PILLARS } from '../home/home.content';

@Component({
  selector: 'app-about',
  imports: [SectionShell],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  readonly manifestoCards = ABOUT_MANIFESTO_CARDS;
  readonly pillars = ABOUT_PILLARS;
}
