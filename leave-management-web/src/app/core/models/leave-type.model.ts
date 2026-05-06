export type LeaveTypeName = 'ANNUAL_LEAVE' | 'SICK_LEAVE' | 'FAMILY_RESPONSIBILITY';

export interface LeaveType {
  id: number;
  name: LeaveTypeName;
  defaultDays: number;
  description: string;
}

