import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Experimental } from './features/experimental/experimental';
import { Snake } from './features/snake/snake';
import { GameOfLife } from './features/game-of-life/game-of-life';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
     {
        path: 'experimental',
        component: Experimental
    },
    {
        path: 'snake',
        component: Snake
    },
    {
        path: 'game-of-life',
        component: GameOfLife
    }
];
