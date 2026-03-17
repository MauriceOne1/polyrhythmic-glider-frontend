import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Background } from './core/layout/background/background';
import { Header } from './core/layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Background],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('polyrhythmic-glider-frontend');
}
