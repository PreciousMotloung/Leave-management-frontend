import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass, TitleCasePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { LeaveService } from '../../../core/services/leave.service';
import { MaterialModule } from '../../../shared/material.module';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { LeaveType } from '../../../core/models/leave-type.model';
import { LeaveBalance } from '../../../core/models/leave-balance.model';

@Component({
  selector: 'app-apply-leave',
  imports: [ReactiveFormsModule, MaterialModule, LoadingSpinnerComponent, NgClass, TitleCasePipe],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.scss'
})
export class ApplyLeaveComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly leaveService = inject(LeaveService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  leaveTypes: LeaveType[] = [];
  balances: LeaveBalance[] = [];
  selectedBalance: LeaveBalance | null = null;

  isLoadingData = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  applyForm = this.fb.group({
    leaveTypeId: [null as number | null, Validators.required],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    reason: ['', [Validators.required, Validators.maxLength(500)]]
  });

  get numberOfDays(): number {
    const start = this.applyForm.value.startDate;
    const end = this.applyForm.value.endDate;
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
  }

  get isBalanceInsufficient(): boolean {
    if (!this.selectedBalance) return false;
    return this.numberOfDays > this.selectedBalance.remainingDays;
  }

  ngOnInit(): void {
    forkJoin({
      types: this.leaveService.getLeaveTypes(),
      balances: this.leaveService.getMyBalances()
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ types, balances }) => {
        this.leaveTypes = types;
        this.balances = balances;
        this.isLoadingData = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load leave types. Please refresh.';
        this.isLoadingData = false;
      }
    });

    this.applyForm.get('leaveTypeId')!.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(id => {
      this.selectedBalance = this.balances.find(b => b.leaveType.id === id) ?? null;
    });
  }

  onSubmit(): void {
    if (this.applyForm.invalid || this.isSubmitting || this.isBalanceInsufficient) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const startDate = this.applyForm.value.startDate as Date;
    const endDate = this.applyForm.value.endDate as Date;

    this.leaveService.submitLeaveRequest({
      leaveTypeId: this.applyForm.value.leaveTypeId!,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      reason: this.applyForm.value.reason!
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.successMessage = 'Leave request submitted successfully!';
        setTimeout(() => this.router.navigate(['/employee/my-leaves']), 1500);
      },
      error: (err: { error?: { message?: string } }) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message ?? 'Submission failed. Please try again.';
      }
    });
  }

  getBalanceClass(remaining: number): string {
    if (remaining > 5) return 'balance-green';
    if (remaining >= 3) return 'balance-amber';
    return 'balance-red';
  }
}
