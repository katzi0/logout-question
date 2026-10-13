import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { LoginPage } from './pages/login/login.page';
import { Shell } from './shell/shell';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { AccountPage } from './pages/account/account.page';

export const routes: Routes = [
  { path: 'login', component: LoginPage, title: 'Log in · Orders' },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPage, title: 'Dashboard · Orders' },
      { path: 'account', component: AccountPage, title: 'Account · Orders' },
    ],
  },
  { path: '**', redirectTo: '' },
];
