import { Routes } from '@angular/router';
import { Stocks } from './features/stock/stocks/stocks';
import { Home } from './features/home/home';
import { Current } from './features/stock/current/current';
import { Movementapprovals } from './features/stock/movementapprovals/movementapprovals';
import { KeyDetailed } from './features/stock/key-detailed/key-detailed';
import { Sales } from './features/sales/sales';
import { HeelDetailed } from './features/stock/heel-detailed/heel-detailed';
import { OtherDetailed } from './features/stock/other-detailed/other-detailed';
import { Orders } from './features/orders/orders';
import { NewOrder } from './features/orders/new-order/new-order';
import { SentConfirmation } from './features/orders/sent-confirmation/sent-confirmation';
import { Reports } from './features/reports/reports';
import { DetailedReport } from './features/reports/detailed-report/detailed-report';
import { Accounts } from './features/accounts/accounts';
import { adminGuard } from './core/guards/admin-guard';
import { loginRequiredGuard } from './core/guards/login-required-guard';
import { ForgotPassword } from './features/accounts/forgot-password/forgot-password';
import { ResetPassword } from './features/accounts/reset-password/reset-password';

export const routes: Routes = [
    {
        path: 'home',
        component: Home,
        canActivate: [loginRequiredGuard]
    },
    {
        path: 'stocks',
        component: Stocks,
        canActivate: [loginRequiredGuard],
        children:
            [
                { path: '', redirectTo: 'current', pathMatch: 'full' },
                { path: 'current', component: Current },
                { path: 'movementapprovals', component: Movementapprovals, canActivate: [adminGuard] },
                { path: 'keys/:id', component: KeyDetailed },
                { path: 'heels/:id', component: HeelDetailed },
                { path: 'others/:id', component: OtherDetailed }
            ]
    },
    {
        path: 'sales', 
        component: Sales, 
        canActivate: [loginRequiredGuard]
    },
    {
        path: 'orders', 
        component: Orders, 
        canActivate: [loginRequiredGuard]
    },
    {
        path: 'orders/sentconfirmation/:id', 
        component: SentConfirmation, 
        canActivate: [adminGuard]
    },
    {
        path: 'editdraft', 
        component: NewOrder, 
        canActivate: [loginRequiredGuard]
    },
    {
        path: 'reports',
        component: Reports,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'daily', pathMatch: 'full' },
            { path: ':reportType', component: DetailedReport }
        ]
    },
    {
        path: 'accounts',
        component: Accounts,
        canActivate: [adminGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPassword
    },
    {
        path: 'reset-password',
        component: ResetPassword
    },
    {
        path: '**',
        component: Home
    }
];
