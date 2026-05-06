import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-team-balances',
  imports: [MaterialModule],
  template: `
    <div style="padding:24px">
      <h2>Team Leave Balances</h2>
      <p>Your team's leave balances will appear here.</p>
    </div>
  `
})
export class TeamBalancesComponent {}

