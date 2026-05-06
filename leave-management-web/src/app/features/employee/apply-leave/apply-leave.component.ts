import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-apply-leave',
  imports: [MaterialModule],
  template: `
    <div style="padding:24px">
      <h2>Apply for Leave</h2>
      <p>The leave application form will appear here.</p>
    </div>
  `
})
export class ApplyLeaveComponent {}

