import { Component } from '@angular/core';
import { SectionShell } from '../../shared/components/section-shell/section-shell';
import { TypewriterDirective } from '../../shared/directives/typewriter.directive';
import { ABOUT_PILLARS } from '../../shared/utils/site-content';

@Component({
  selector: 'app-about',
  imports: [SectionShell, TypewriterDirective],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly pillars = ABOUT_PILLARS;
}
