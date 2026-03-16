import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './core/site-header/site-header';
import { SiteFooter } from './core/site-footer/site-footer';
import { Background } from './core/background/background';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, Background],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('polyrhythmic-glider-frontend');
}
