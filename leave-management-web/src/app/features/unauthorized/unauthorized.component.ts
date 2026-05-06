import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  imports: [MaterialModule],
  template: `
    <div class="error-page">
      <mat-card class="error-card">
        <mat-card-content>
          <mat-icon class="error-icon">lock</mat-icon>
          <h1>403</h1>
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
          <button mat-raised-button color="primary" (click)="goToDashboard()">Go to My Dashboard</button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .error-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      padding: 24px;
    }
    .error-card {
      text-align: center;
      padding: 48px 40px;
      max-width: 420px;
      width: 100%;
    }
    .error-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #f44336;
      margin-bottom: 16px;
    }
    h1 { font-size: 64px; font-weight: 700; color: #f44336; margin: 0 0 8px; }
    h2 { margin: 0 0 16px; }
    p { color: #666; margin-bottom: 24px; }
  `]
})
export class UnauthorizedComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  goToDashboard(): void {
    const role = this.authService.getRole();
    if (role === 'MANAGER') {
      this.router.navigate(['/manager/dashboard']);
    } else if (role === 'EMPLOYEE') {
      this.router.navigate(['/employee/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
