import { Routes } from '@angular/router';
import { Stocks } from './features/stock/stocks/stocks';
import { Home } from './features/home/home';
import { Current } from './features/stock/current/current';
import { Movementapprovals } from './features/stock/movementapprovals/movementapprovals';
import { KeyDetailed } from './features/stock/key-detailed/key-detailed';
import { Sales } from './features/sales/sales';
import { HeelDetailed } from './features/stock/heel-detailed/heel-detailed';
import { Orders } from './features/orders/orders';
import { NewOrder } from './features/orders/new-order/new-order';

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
                { path: 'current', component: Current },
                { path: 'movementapprovals', component: Movementapprovals },
                { path: 'keys/:id', component: KeyDetailed },
                { path: 'heels/:id', component: HeelDetailed }
            ]
    },
    {
        path: 'sales', component: Sales
    },
    {
        path: 'orders', component: Orders
    },
    {
        path: 'editdraft', component: NewOrder
    },
    {
        path: '**',
        component: Home
    }
];
