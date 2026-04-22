import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionShell } from '../../shared/components/section-shell/section-shell';

@Component({
  selector: 'app-cookie-policy',
  imports: [RouterLink, SectionShell],
  templateUrl: './cookie-policy.html',
  styleUrl: './cookie-policy.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiePolicy {}
