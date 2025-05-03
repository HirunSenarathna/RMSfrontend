import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { OwnerNavbarComponent } from '../owner-navbar/owner-navbar.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-owner-sidebar',
  imports: [MatSidenavModule, MatListModule,RouterModule],
  templateUrl: './owner-sidebar.component.html',
  styleUrl: './owner-sidebar.component.css'
})
export class OwnerSidebarComponent {

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        alert('You have been logged out');
        this.router.navigate(['/']); // Redirect to homepage or login
      },
      error: (err) => {
        console.error('Logout failed', err);
        alert('Logout failed');
      }
    });
  }

}
