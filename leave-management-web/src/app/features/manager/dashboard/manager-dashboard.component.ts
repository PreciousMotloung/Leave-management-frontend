import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { MaterialModule } from '../../../shared/material.module';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LeaveRequest } from '../../../core/models/leave-request.model';

@Component({
  selector: 'app-manager-dashboard',
  imports: [MaterialModule, RouterLink, DatePipe, TitleCasePipe, LoadingSpinnerComponent, StatusChipComponent, EmptyStateComponent],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})
export class ManagerDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly leaveService = inject(LeaveService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = this.authService.getCurrentUser();

  isLoading = true;
  errorMessage = '';
  pendingRequests: LeaveRequest[] = [];

  get pendingCount(): number { return this.pendingRequests.length; }

  get approvedThisMonth(): number {
    const now = new Date();
    return this.pendingRequests.filter(r =>
      r.status === 'APPROVED' &&
      new Date(r.createdAt).getMonth() === now.getMonth() &&
      new Date(r.createdAt).getFullYear() === now.getFullYear()
    ).length;
  }

  get rejectedThisMonth(): number {
    const now = new Date();
    return this.pendingRequests.filter(r =>
      r.status === 'REJECTED' &&
      new Date(r.createdAt).getMonth() === now.getMonth() &&
      new Date(r.createdAt).getFullYear() === now.getFullYear()
    ).length;
  }

  ngOnInit(): void {
    this.leaveService.getPendingRequests().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (requests) => {
        this.pendingRequests = requests;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load pending requests.';
        this.isLoading = false;
      }
    });
  }
}
