import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    title: 'Login — Leave Manager',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    title: 'Register — Leave Manager',
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
        title: 'My Dashboard — Leave Manager',
        loadComponent: () =>
          import('./features/employee/dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent)
      },
      {
        path: 'my-leaves',
        title: 'My Leave Requests — Leave Manager',
        loadComponent: () =>
          import('./features/employee/my-leaves/my-leaves.component').then(m => m.MyLeavesComponent)
      },
      {
        path: 'apply-leave',
        title: 'Apply for Leave — Leave Manager',
        loadComponent: () =>
          import('./features/employee/apply-leave/apply-leave.component').then(m => m.ApplyLeaveComponent)
      }
    ]
  },
  {
    path: 'manager',
    canActivate: [authGuard, roleGuard],
    data: { role: 'MANAGER' },
    loadComponent: () =>
      import('./features/manager/shell/manager-shell.component').then(m => m.ManagerShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        title: 'Manager Dashboard — Leave Manager',
        loadComponent: () =>
          import('./features/manager/dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent)
      },
      {
        path: 'pending-requests',
        title: 'Pending Requests — Leave Manager',
        loadComponent: () =>
          import('./features/manager/pending-requests/pending-requests.component').then(m => m.PendingRequestsComponent)
      },
      {
        path: 'team-balances',
        title: 'Team Balances — Leave Manager',
        loadComponent: () =>
          import('./features/manager/team-balances/team-balances.component').then(m => m.TeamBalancesComponent)
      }
    ]
  },
  {
    path: 'unauthorized',
    title: 'Access Denied — Leave Manager',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '404',
    title: 'Page Not Found — Leave Manager',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  { path: '**', redirectTo: '404' }
];
