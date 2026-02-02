import { Routes } from '@angular/router';
import { Stocks } from './features/stock/stocks/stocks';
import { Home } from './features/home/home';
import { Current } from './features/stock/current/current';
import { Movementapprovals } from './features/stock/movementapprovals/movementapprovals';
import { KeyDetailed } from './features/stock/key-detailed/key-detailed';

export const routes: Routes = [
    {
        path: 'home',
        component: Home
    },
    {
        path: 'stocks',
        component: Stocks,
        children:
            [
                { path: '', redirectTo: 'current', pathMatch: 'full' },
                {path: 'current', component: Current},
                {path: 'movementapprovals', component: Movementapprovals},
                {path: 'keys/:id', component: KeyDetailed}
            ]
    },
    {
        path: '**',
        component: Home
    }
];
