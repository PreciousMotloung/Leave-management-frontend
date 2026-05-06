import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { LeaveStatus } from '../../../core/models/leave-request.model';

@Component({
  selector: 'app-status-chip',
  imports: [MaterialModule, NgClass],
  template: `
    <mat-chip [ngClass]="chipClass" [disableRipple]="true">{{ status }}</mat-chip>
  `,
  styles: [`
    mat-chip { font-weight: 600; font-size: 12px; }
  `]
})
export class StatusChipComponent {
  @Input() status: LeaveStatus = 'PENDING';

  get chipClass(): string {
    return `chip-${this.status.toLowerCase()}`;
  }
}

