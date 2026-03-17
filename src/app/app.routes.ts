import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Experimental } from './features/experimental/experimental';
import { Snake } from './features/snake/snake';

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
    }
];
