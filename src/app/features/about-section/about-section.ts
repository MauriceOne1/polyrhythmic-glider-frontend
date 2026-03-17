import { Component } from '@angular/core';
import { TypewriterDirective } from '../../shared/directives/typewriter.directive';

@Component({
  selector: 'app-about-section',
  imports: [TypewriterDirective],
  templateUrl: './about-section.html',
  styleUrl: './about-section.css',
})
export class AboutSection {}
