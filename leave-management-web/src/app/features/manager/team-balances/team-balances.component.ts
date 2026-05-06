import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LeaveService } from '../../../core/services/leave.service';
import { MaterialModule } from '../../../shared/material.module';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LeaveBalance } from '../../../core/models/leave-balance.model';

@Component({
  selector: 'app-team-balances',
  imports: [MaterialModule, ReactiveFormsModule, NgClass, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './team-balances.component.html',
  styleUrl: './team-balances.component.scss'
})
export class TeamBalancesComponent {
  private readonly leaveService = inject(LeaveService);
  private readonly destroyRef = inject(DestroyRef);

  readonly userIdControl = new FormControl<number | null>(null, [Validators.required, Validators.min(1)]);

  isLoading = false;
  errorMessage = '';
  searched = false;
  balances: LeaveBalance[] = [];

  readonly displayedColumns = ['leaveType', 'available', 'used', 'remaining'];

  search(): void {
    if (this.userIdControl.invalid || this.userIdControl.value === null) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.searched = true;

    this.leaveService.getUserLeaveBalances(this.userIdControl.value).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        this.balances = data;
        this.isLoading = false;
      },
      error: (err: { status?: number; error?: { message?: string } }) => {
        this.errorMessage = err?.status === 404
          ? 'No user found with that ID.'
          : (err?.error?.message ?? 'Failed to load balances. Please try again.');
        this.balances = [];
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
