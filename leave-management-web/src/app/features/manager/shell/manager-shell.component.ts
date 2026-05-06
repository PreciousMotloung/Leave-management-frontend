import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-manager-shell',
  imports: [MaterialModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './manager-shell.component.html',
  styleUrl: './manager-shell.component.scss'
})
export class ManagerShellComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly leaveService = inject(LeaveService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = this.authService.getCurrentUser();
  pendingCount = 0;

  get fullName(): string {
    return this.user ? `${this.user.firstName} ${this.user.lastName}` : 'Manager';
  }

  ngOnInit(): void {
    this.leaveService.getPendingRequests().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (requests) => { this.pendingCount = requests.length; },
      error: () => { this.pendingCount = 0; }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

