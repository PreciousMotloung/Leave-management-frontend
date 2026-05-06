import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-unauthorized',
  imports: [MaterialModule, RouterLink],
  template: `
    <div class="page-container">
      <mat-card class="card-form" style="text-align:center; padding: 48px 24px;">
        <mat-icon style="font-size:64px;width:64px;height:64px;color:#f44336;">lock</mat-icon>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <a mat-raised-button color="primary" routerLink="/login">Back to Login</a>
      </mat-card>
    </div>
  `
})
export class UnauthorizedComponent {}

