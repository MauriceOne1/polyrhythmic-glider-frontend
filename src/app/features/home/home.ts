import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { Contact } from '../contact/contact';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Footer } from '../../core/layout/footer/footer';

@Component({
  selector: 'app-home',
  imports: [CommonModule, About, Hero, Contact, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.location.hash) {
      return;
    }

    if (!window.matchMedia('(max-width: 899px)').matches) {
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
    });
  }
}
