import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionShell } from '../../shared/components/section-shell/section-shell';
import { ART_EXHIBITS, ART_FORMATS, ART_METRICS, ART_PROGRAM } from './art.content';

@Component({
  selector: 'app-art',
  imports: [SectionShell],
  templateUrl: './art.html',
  styleUrl: './art.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Art {
  readonly metrics = ART_METRICS;
  readonly exhibits = ART_EXHIBITS;
  readonly program = ART_PROGRAM;
  readonly formats = ART_FORMATS;
}
