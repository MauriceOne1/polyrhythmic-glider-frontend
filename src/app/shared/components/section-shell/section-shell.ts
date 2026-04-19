import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-shell',
  templateUrl: './section-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionShell {
  readonly kicker = input.required<string>();
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly wideHeader = input(false, { transform: booleanAttribute });
}
