import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-my-leaves',
  imports: [MaterialModule],
  template: `
    <div style="padding:24px">
      <h2>My Leaves</h2>
      <p>Your leave requests will appear here.</p>
    </div>
  `
})
export class MyLeavesComponent {}

