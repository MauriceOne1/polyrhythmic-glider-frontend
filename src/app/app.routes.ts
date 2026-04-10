import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Experimental } from './features/experimental/experimental';
import { Snake } from './features/snake/snake';
import { GameOfLife } from './features/game-of-life/game-of-life';
import { Admin } from './features/admin/admin';
import { Login } from './features/login/login';
import { Participation } from './features/participation/participation';
import { identityGuard } from './core/identity/identity.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    data: {
      seo: {
        title: 'Polyrhythmic Glider | Musica, codice ed esperimenti digitali',
        description:
          'Polyrhythmic Glider e uno spazio per musica, codice ed esperimenti digitali tra ricerca sonora, documentazione e sistemi aperti.',
        keywords: ['polyrhythmic glider', 'musica', 'codice', 'esperimenti digitali', 'ricerca sonora'],
      },
    },
  },
  {
    path: 'experimental',
    component: Experimental,
    data: {
      seo: {
        title: 'Experimental | Polyrhythmic Glider',
        description:
          'Sandbox di live coding per pattern ritmici, sketch veloci e workflow da performance dentro Polyrhythmic Glider.',
        keywords: ['live coding', 'strudel', 'pattern ritmici', 'performance', 'experimental'],
      },
    },
  },
  {
    path: 'snake',
    component: Snake,
    data: {
      seo: {
        title: 'Snake | Polyrhythmic Glider',
        description:
          'Versione browser di Snake con controlli da tastiera e touch, punteggio live e loop di gioco essenziale.',
        keywords: ['snake game', 'browser game', 'angular game', 'interactive experiment'],
      },
    },
  },
  {
    path: 'game-of-life',
    component: GameOfLife,
    data: {
      seo: {
        title: 'Game of Life | Polyrhythmic Glider',
        description:
          'Esperimento visivo dedicato al Game of Life di Conway con simulazione animata e background generativo.',
        keywords: ['game of life', 'conway', 'cellular automaton', 'generative art', 'visual experiment'],
      },
    },
  },
  {
    path: 'login',
    component: Login,
    data: {
      seo: {
        title: 'Login | Polyrhythmic Glider',
        description:
          'Accesso con Netlify Identity per entrare nelle aree riservate di Polyrhythmic Glider.',
        keywords: ['login', 'netlify identity', 'authentication'],
        robots: 'noindex,nofollow',
      },
    },
  },
  {
    path: 'partecipa',
    component: Participation,
    data: {
      seo: {
        title: 'Partecipa | BYOS! an electronic synth jam',
        description:
          'Landing page dedicata alla synth jam BYOS! con form di partecipazione per raccogliere presenza, setup e intenzioni musicali.',
        keywords: ['byos', 'synth jam', 'electronic jam', 'partecipazione', 'polyrhythmic glider'],
      },
    },
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [identityGuard],
    data: {
      seo: {
        title: 'Admin | Polyrhythmic Glider',
        description: 'Area amministrativa privata accessibile solo dopo autenticazione.',
        keywords: ['admin', 'private area', 'authentication'],
        robots: 'noindex,nofollow',
      },
    },
  },
];
