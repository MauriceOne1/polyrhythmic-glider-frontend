import { Component } from '@angular/core';
import { TypewriterDirective } from '../../shared/directives/typewriter.directive';

@Component({
  selector: 'app-about',
  imports: [
    TypewriterDirective
  ],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {}
