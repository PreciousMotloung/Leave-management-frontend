import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { MaterialModule } from '../../../shared/material.module';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LeaveBalance } from '../../../core/models/leave-balance.model';
import { LeaveRequest } from '../../../core/models/leave-request.model';

@Component({
  selector: 'app-employee-dashboard',
  imports: [MaterialModule, RouterLink, NgClass, DatePipe, LoadingSpinnerComponent, StatusChipComponent, EmptyStateComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})
export class EmployeeDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly leaveService = inject(LeaveService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = this.authService.getCurrentUser();

  isLoading = true;
  errorMessage = '';
  balances: LeaveBalance[] = [];
  recentRequests: LeaveRequest[] = [];

  ngOnInit(): void {
    forkJoin({
      balances: this.leaveService.getMyBalances(),
      requests: this.leaveService.getMyLeaveRequests()
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ({ balances, requests }) => {
        this.balances = balances;
        this.recentRequests = requests.slice(0, 5);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load dashboard data. Please refresh the page.';
        this.isLoading = false;
      }
    });
  }

  getBalanceClass(remaining: number): string {
    if (remaining > 5) return 'balance-green';
    if (remaining >= 3) return 'balance-amber';
    return 'balance-red';
  }
}
