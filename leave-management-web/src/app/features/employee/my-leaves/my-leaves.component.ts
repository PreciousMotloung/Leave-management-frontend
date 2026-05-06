import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { LeaveService } from '../../../core/services/leave.service';
import { MaterialModule } from '../../../shared/material.module';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LeaveRequest } from '../../../core/models/leave-request.model';

@Component({
  selector: 'app-my-leaves',
  imports: [MaterialModule, DatePipe, StatusChipComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './my-leaves.component.html',
  styleUrl: './my-leaves.component.scss'
})
export class MyLeavesComponent implements OnInit {
  private readonly leaveService = inject(LeaveService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly displayedColumns = ['leaveType', 'startDate', 'endDate', 'numberOfDays', 'status', 'actions'];

  isLoading = true;
  errorMessage = '';
  requests: LeaveRequest[] = [];

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.leaveService.getMyLeaveRequests().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load leave requests. Please try again.';
        this.isLoading = false;
      }
    });
  }

  confirmCancel(request: LeaveRequest): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cancel Leave Request',
        message: `Are you sure you want to cancel your ${request.leaveType} leave request from ${request.startDate} to ${request.endDate}?`,
        confirmText: 'Yes, Cancel It',
        cancelText: 'Keep It'
      }
    });

    ref.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.cancelRequest(request.id);
      }
    });
  }

  private cancelRequest(id: number): void {
    this.leaveService.cancelLeaveRequest(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => this.loadRequests(),
      error: () => {
        this.errorMessage = 'Failed to cancel the request. Please try again.';
      }
    });
  }
}
