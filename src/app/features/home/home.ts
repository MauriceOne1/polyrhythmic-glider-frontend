import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact } from '../contact/contact';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Footer } from '../../core/layout/footer/footer';
import { SectionShell } from '../../shared/components/section-shell/section-shell';

interface ResourceLink {
  readonly label: string;
  readonly path: string;
  readonly eyebrow: string;
  readonly description: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, About, Hero, Contact, Footer, SectionShell],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  readonly resources: ResourceLink[] = [
    {
      label: 'Polyblog',
      path: '/blog',
      eyebrow: 'Appunti',
      description:
        'Bozze tecniche, formule, codice e frammenti da trasformare in articoli veri.',
    },
    {
      label: 'BYOS!',
      path: '/partecipa',
      eyebrow: 'Jam',
      description:
        'Form di partecipazione per la synth jam con setup, presenza e intenzioni musicali.',
    },
    {
      label: 'Live coding sandbox',
      path: '/experimental',
      eyebrow: 'Studio',
      description:
        'Ambiente Strudel per pattern ritmici, sketch performativi e prove rapide.',
    },
    {
      label: 'Game of Life',
      path: '/game-of-life',
      eyebrow: 'Simulazione',
      description:
        'Esperimento visuale con automa cellulare e background generativo dedicato.',
    },
    {
      label: 'Snake',
      path: '/snake',
      eyebrow: 'Gioco',
      description:
        'Microgioco browser con controlli da tastiera e touch, punteggio e loop essenziale.',
    },
    {
      label: 'Area admin',
      path: '/admin',
      eyebrow: 'Privato',
      description:
        'Spazio riservato per gestione e strumenti interni, accessibile solo con autenticazione.',
    },
  ];

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
