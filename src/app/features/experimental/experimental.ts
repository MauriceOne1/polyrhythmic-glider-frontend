import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-experimental',
  imports: [],
  templateUrl: './experimental.html',
  styleUrl: './experimental.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experimental {}
