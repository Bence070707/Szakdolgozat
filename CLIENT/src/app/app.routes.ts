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
import { SentConfirmation } from './features/orders/sent-confirmation/sent-confirmation';
import { Reports } from './features/reports/reports';
import { DetailedReport } from './features/reports/detailed-report/detailed-report';

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
        path: 'orders/sentconfirmation/:id', component: SentConfirmation
    },
    {
        path: 'editdraft', component: NewOrder
    },
    {
        path: 'reports',
        component: Reports,
        children: [
            { path: '', redirectTo: 'daily', pathMatch: 'full' },
            { path: ':reportType', component: DetailedReport }
        ]
    },
    {
        path: '**',
        component: Home
    }
];
