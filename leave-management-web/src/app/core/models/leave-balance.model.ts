import { LeaveType } from './leave-type.model';

export interface LeaveBalance {
  id: number;
  leaveType: LeaveType;
  availableDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
}
