import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-pending-requests',
  imports: [MaterialModule],
  template: `
    <div style="padding:24px">
      <h2>Pending Requests</h2>
      <p>Leave requests awaiting your approval will appear here.</p>
    </div>
  `
})
export class PendingRequestsComponent {}

