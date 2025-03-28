import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';


import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
     MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user = { firstName: '', lastName: '', address: '', email: '', phone: '', password: '' };
  luser = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        
        console.log('Registration successful:', response);
        this.router.navigate(['/login']); 
      },
      error: (error) => {
        console.error('Registration failed:', error);
      }
    });
  }

  login() {
    this.authService.login(this.luser).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        if (response.role === 'ROLE_OWNER') {
          this.router.navigate(['/owner']);
        }else if (response.role === 'ROLE_CUSTOMER'){
          this.router.navigate(['/customer'])
        }
         else if (response.role === 'ROLE_WAITER') {
          this.router.navigate(['/waiter']);
        } else if (response.role === 'ROLE_CASHIER') {
          this.router.navigate(['/cashier']);
        } else {
          this.router.navigate(['']);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Invalid email or password');
      }
    });
  }

  loginWithGoogle() {
    // Implement Google Authentication logic here
    console.log("Google Sign-In Clicked");
  }

  forgotPassword() {
    // Implement forgot password logic (navigate to reset page)
    console.log("Forgot Password Clicked");
  }
}