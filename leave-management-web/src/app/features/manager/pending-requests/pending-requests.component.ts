import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe, TitleCasePipe, SlicePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeaveService } from '../../../core/services/leave.service';
import { MaterialModule } from '../../../shared/material.module';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { RejectDialogComponent } from '../../../shared/components/reject-dialog/reject-dialog.component';
import { LeaveRequest } from '../../../core/models/leave-request.model';

@Component({
  selector: 'app-pending-requests',
  imports: [MaterialModule, DatePipe, TitleCasePipe, SlicePipe, ReactiveFormsModule, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './pending-requests.component.html',
  styleUrl: './pending-requests.component.scss'
})
export class PendingRequestsComponent implements OnInit {
  private readonly leaveService = inject(LeaveService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly displayedColumns = ['employee', 'leaveType', 'startDate', 'endDate', 'days', 'reason', 'actions'];

  isLoading = true;
  errorMessage = '';
  requests: LeaveRequest[] = [];

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.leaveService.getPendingRequests().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load pending requests. Please try again.';
        this.isLoading = false;
      }
    });
  }

  confirmApprove(request: LeaveRequest): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Approve Leave Request',
        message: `Approve ${request.user?.firstName} ${request.user?.lastName}'s ${request.leaveType?.name?.replace(/_/g, ' ')} leave request (${request.numberOfDays} day(s))?`,
        confirmText: 'Approve',
        cancelText: 'Cancel'
      },
      width: '420px'
    });

    ref.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((confirmed: boolean) => {
      if (confirmed) { this.approve(request.id); }
    });
  }

  confirmReject(request: LeaveRequest): void {
    const ref = this.dialog.open(RejectDialogComponent, {
      data: {
        employeeName: `${request.user?.firstName} ${request.user?.lastName}`,
        leaveType: request.leaveType?.name?.replace(/_/g, ' ')
      },
      width: '480px'
    });

    ref.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((rejectionReason: string | undefined) => {
      if (rejectionReason) { this.reject(request.id, rejectionReason); }
    });
  }

  private approve(id: number): void {
    this.leaveService.approveLeave(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id !== id);
        this.snackBar.open('Leave request approved.', 'Close', { duration: 3000 });
      },
      error: (err: { error?: { message?: string } }) => {
        this.snackBar.open(err?.error?.message ?? 'Failed to approve. Please try again.', 'Close', { duration: 4000 });
      }
    });
  }

  private reject(id: number, rejectionReason: string): void {
    this.leaveService.rejectLeave(id, rejectionReason).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id !== id);
        this.snackBar.open('Leave request rejected.', 'Close', { duration: 3000 });
      },
      error: (err: { error?: { message?: string } }) => {
        this.snackBar.open(err?.error?.message ?? 'Failed to reject. Please try again.', 'Close', { duration: 4000 });
      }
    });
  }
}
