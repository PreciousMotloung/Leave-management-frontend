import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-employee-dashboard',
  imports: [MaterialModule],
  template: `
    <div style="padding:24px">
      <h2>Employee Dashboard</h2>
      <p>Welcome! Your leave summary will appear here.</p>
    </div>
  `
})
export class EmployeeDashboardComponent {}

