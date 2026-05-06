import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-manager-dashboard',
  imports: [MaterialModule],
  template: `
    <div style="padding:24px">
      <h2>Manager Dashboard</h2>
      <p>Your team overview will appear here.</p>
    </div>
  `
})
export class ManagerDashboardComponent {}

