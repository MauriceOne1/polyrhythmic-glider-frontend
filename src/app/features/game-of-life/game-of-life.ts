import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-game-of-life',
  imports: [FontAwesomeModule],
  templateUrl: './game-of-life.html',
  styleUrl: './game-of-life.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOfLife {
  readonly isContentVisible = signal(true);
  readonly dismissIcon = faXmark;

  dismissContent(): void {
    this.isContentVisible.set(false);
  }
}
