import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, User } from '../../../services/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-owner-navbar',
  imports: [RouterModule,CommonModule,MatToolbarModule,MatIconModule],
  templateUrl: './owner-navbar.component.html',
  styleUrl: './owner-navbar.component.css'
})
export class OwnerNavbarComponent implements OnInit {

  constructor(private authService: AuthService) {}

  menuClass: boolean = false;
  currentUser: User | null = null;
  userInitials: string = '';


  ngOnInit(): void {
    // Subscribe to the current user observable to get user data
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;

      console.log('Current User:', this.currentUser);
      
      // // Generate initials if no profile image is available
      // if (this.currentUser && this.currentUser.firstName && this.currentUser.lastName) {
      //   this.userInitials = this.currentUser.firstName.charAt(0) + 
      //                      this.currentUser.lastName.charAt(0);
      // }
    });
  }

  toggleMobOption() {
    this.menuClass = !this.menuClass;
  }

 
}
