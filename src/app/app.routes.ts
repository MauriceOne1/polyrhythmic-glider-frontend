import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Experimental } from './features/experimental/experimental';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
     {
        path: 'experimental',
        component: Experimental
    }
];