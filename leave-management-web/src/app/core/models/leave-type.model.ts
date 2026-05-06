export type LeaveTypeName = 'ANNUAL' | 'SICK' | 'FAMILY_RESPONSIBILITY' | 'UNPAID' | 'STUDY';

export interface LeaveType {
  id: number;
  name: LeaveTypeName;
  description: string;
  defaultDays: number;
}

