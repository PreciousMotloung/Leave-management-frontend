import { Component, Inject } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

export interface RejectDialogData {
  employeeName: string;
  leaveType: string;
}

@Component({
  selector: 'app-reject-dialog',
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Reject Leave Request</h2>
    <mat-dialog-content>
      <p>Rejecting <strong>{{ data.employeeName }}</strong>'s <strong>{{ data.leaveType }}</strong> leave request.</p>
      <p>A reason is required:</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Rejection Reason</mat-label>
        <textarea matInput [formControl]="reasonControl" rows="4" maxlength="500"
          placeholder="Explain why this leave request is being rejected..."></textarea>
        <mat-hint align="end">{{ reasonControl.value?.length ?? 0 }}/500</mat-hint>
        @if (reasonControl.hasError('required') && reasonControl.touched) {
          <mat-error>A rejection reason is required</mat-error>
        }
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="undefined">Cancel</button>
      <button mat-raised-button color="warn"
        [disabled]="reasonControl.invalid"
        (click)="submit()">Reject Request</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; min-width: 340px; } p { margin-bottom: 8px; }`]
})
export class RejectDialogComponent {
  readonly reasonControl = new FormControl('', [Validators.required, Validators.maxLength(500)]);

  constructor(
    public dialogRef: MatDialogRef<RejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RejectDialogData
  ) {}

  submit(): void {
    if (this.reasonControl.valid) {
      this.dialogRef.close(this.reasonControl.value!);
    }
  }
}

