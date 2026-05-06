import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LeaveRequest, ApplyLeaveRequest } from '../models/leave-request.model';
import { LeaveBalance } from '../models/leave-balance.model';
import { LeaveType } from '../models/leave-type.model';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Employee endpoints
  getMyLeaveRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/api/leave/my-requests`);
  }

  getMyBalances(): Observable<LeaveBalance[]> {
    return this.http.get<LeaveBalance[]>(`${this.apiUrl}/api/leave/balance`);
  }

  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(`${this.apiUrl}/api/leave/types`);
  }

  submitLeaveRequest(request: ApplyLeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}/api/leave/submit`, request);
  }

  cancelLeaveRequest(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/api/leave/${id}/cancel`, {});
  }

  // Manager endpoints
  getPendingRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/api/manager/leaves/pending`);
  }

  approveLeave(id: number): Observable<LeaveRequest> {
    return this.http.patch<LeaveRequest>(`${this.apiUrl}/api/manager/leaves/${id}/approve`, {});
  }

  rejectLeave(id: number, reason: string): Observable<LeaveRequest> {
    return this.http.patch<LeaveRequest>(`${this.apiUrl}/api/manager/leaves/${id}/reject`, { reason });
  }

  getTeamBalances(): Observable<LeaveBalance[]> {
    return this.http.get<LeaveBalance[]>(`${this.apiUrl}/api/manager/team/balances`);
  }
}
