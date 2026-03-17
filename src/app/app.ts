import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/header/header';
import { Background } from './core/background/background';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Background],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('polyrhythmic-glider-frontend');
}
