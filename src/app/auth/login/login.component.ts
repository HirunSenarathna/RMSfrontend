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

  user = { firstname: '', lastname: '', address: '', email: '', phone: '',username:'', password: '' };
  luser = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        
        console.log('Registration successful:', response);
        this.router.navigate(['/']); 
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
        localStorage.setItem('user', JSON.stringify(response)); // Store user data
        console.log("User Role: ", response.role);
        console.log("User ID: ", response.id);
        console.log("User First Name: ", response.firstName);
        console.log("User Last Name: ", response.lastName);

        if (response.role === 'OWNER') {
          this.router.navigate(['/owner']);
        }else if (response.role === 'CUSTOMER'){
          this.router.navigate(['/customer'])
        }
         else if (response.role === 'WAITER') {
          this.router.navigate(['/waiter']);
        } else if (response.role === 'CASHIER') {
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