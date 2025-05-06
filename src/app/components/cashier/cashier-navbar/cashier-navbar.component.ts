import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cashier-navbar',
  imports: [ButtonModule,RouterModule],
  templateUrl: './cashier-navbar.component.html',
  styleUrl: './cashier-navbar.component.css'
})
export class CashierNavbarComponent {

}
