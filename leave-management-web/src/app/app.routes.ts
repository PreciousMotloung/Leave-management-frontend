import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'employee',
    canActivate: [authGuard, roleGuard],
    data: { role: 'EMPLOYEE' },
    loadComponent: () =>
      import('./features/employee/shell/employee-shell.component').then(m => m.EmployeeShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/employee/dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent)
      },
      {
        path: 'my-leaves',
        loadComponent: () =>
          import('./features/employee/my-leaves/my-leaves.component').then(m => m.MyLeavesComponent)
      },
      {
        path: 'apply-leave',
        loadComponent: () =>
          import('./features/employee/apply-leave/apply-leave.component').then(m => m.ApplyLeaveComponent)
      }
    ]
  },
  {
    path: 'manager',
    canActivate: [authGuard, roleGuard],
    data: { role: 'MANAGER' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/manager/dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent)
      },
      {
        path: 'pending-requests',
        loadComponent: () =>
          import('./features/manager/pending-requests/pending-requests.component').then(m => m.PendingRequestsComponent)
      },
      {
        path: 'team-balances',
        loadComponent: () =>
          import('./features/manager/team-balances/team-balances.component').then(m => m.TeamBalancesComponent)
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  { path: '**', redirectTo: '404' }
];
