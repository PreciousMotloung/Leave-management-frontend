import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-not-found',
  imports: [MaterialModule, RouterLink],
  template: `
    <div class="error-page">
      <mat-card class="error-card">
        <mat-card-content>
          <mat-icon class="error-icon">search_off</mat-icon>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for does not exist or has been moved.</p>
          <a mat-raised-button color="primary" routerLink="/login">Go to Login</a>
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
      color: #9e9e9e;
      margin-bottom: 16px;
    }
    h1 { font-size: 64px; font-weight: 700; color: #9e9e9e; margin: 0 0 8px; }
    h2 { margin: 0 0 16px; }
    p { color: #666; margin-bottom: 24px; }
  `]
})
export class NotFoundComponent {}
