import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-employee-shell',
  imports: [MaterialModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './employee-shell.component.html',
  styleUrl: './employee-shell.component.scss'
})
export class EmployeeShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.getCurrentUser();

  get fullName(): string {
    return this.user ? `${this.user.firstName} ${this.user.lastName}` : 'Employee';
  }

  logout(): void {
    this.authService.logout();
  }
}

