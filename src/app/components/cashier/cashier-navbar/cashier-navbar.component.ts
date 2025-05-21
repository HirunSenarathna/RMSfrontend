import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AuthService,User } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cashier-navbar',
  imports: [ButtonModule,RouterModule, MenuModule, AvatarModule,CommonModule],
  templateUrl: './cashier-navbar.component.html',
  styleUrl: './cashier-navbar.component.css'
})
export class CashierNavbarComponent implements OnInit {

  profileItems: MenuItem[] = [];
  userName: string = '';
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Get current user information
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.userName = `${user.firstname} ${user.lastname}`;
      }
    });

    // Set up profile menu items
    this.profileItems = [
      {
        label: 'My Profile',
        icon: 'pi pi-user',
        routerLink: '/profile'
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logged out successfully', response);
        // Navigation is handled by the AuthService
      },
      error: (error) => {
        console.error('Error during logout:', error);
      }
    });
  }

}
