import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-shell',
  templateUrl: './section-shell.html',
})
export class SectionShell {
  readonly kicker = input.required<string>();
  readonly title = input<string>('');
  readonly description = input<string>('');
}
