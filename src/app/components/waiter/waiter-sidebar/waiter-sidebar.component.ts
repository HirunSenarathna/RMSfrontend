import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-waiter-sidebar',
  imports: [RouterModule],
  templateUrl: './waiter-sidebar.component.html',
  styleUrl: './waiter-sidebar.component.css'
})
export class WaiterSidebarComponent {

   constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Logout success (local logout is already handled in AuthService)
        this.router.navigate(['/login']); // navigate to login or other page
      },
      error: err => {
        console.error('Logout error:', err);
        // Optionally navigate away anyway
        this.router.navigate(['/login']);
      }
    });
  }

}
