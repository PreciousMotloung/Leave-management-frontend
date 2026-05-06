import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-not-found',
  imports: [MaterialModule, RouterLink],
  template: `
    <div class="page-container">
      <mat-card class="card-form" style="text-align:center; padding: 48px 24px;">
        <mat-icon style="font-size:64px;width:64px;height:64px;color:#9e9e9e;">search_off</mat-icon>
        <h2>404 — Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <a mat-raised-button color="primary" routerLink="/login">Go Home</a>
      </mat-card>
    </div>
  `
})
export class NotFoundComponent {}

