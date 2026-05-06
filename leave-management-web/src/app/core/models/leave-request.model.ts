export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveRequest {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface ApplyLeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

