import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';


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

   // Registration form user object
  user = {
    firstname: '',
    lastname: '',
    address: '',
    email: '',
    phone: '',
    username: '',
    password: ''
  };

  // Login form user object
  luser = {
    identifier: '',
    password: ''
  };

  isRegistering = false;
  isLoggingIn = false;
  registrationError = '';
  loginError = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  register() {
    console.log('Registering user');
    // Show loading state
    this.isRegistering = true;
    this.registrationError = '';
    
    // Create the customer registration object
    const customerData = {
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email,
      phone: this.user.phone,
      username: this.user.username,
      password: this.user.password,
      address: this.user.address
    };

    console.log('senging Customer Data:', customerData);
    // Call the AuthService to register the user
    this.authService.register(customerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isRegistering = false;
        
        // Show success message
        this.snackBar.open('Registration successful! Please log in.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        
        // Auto-check the login tab
        const checkbox = document.getElementById('chk') as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = true;
        }
        
        // Clear registration form
        this.resetRegistrationForm();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Registration failed:', error);
        this.isRegistering = false;
        
        if (error.status === 409) {
          this.registrationError = 'Username or email already exists. Please try another.';
        } else {
          this.registrationError = error.error?.message || 'Registration failed. Please try again.';
        }
        
        this.snackBar.open(this.registrationError, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  login() {
    // Show loading state
    this.isLoggingIn = true;
    this.loginError = '';
    
    this.authService.login(this.luser).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoggingIn = false;
        
         // Store token in local storage if it's not already stored by the service
      if (response.accessToken) {
        localStorage.setItem('auth_token', response.accessToken);
      } else if (response.token) {
        // Handle case where backend returns token instead of accessToken
        localStorage.setItem('auth_token', response.token);
      }
        
        // Navigate based on user role
        if (response.role === 'OWNER') {
          this.router.navigate(['/owner']);
        } else if (response.role === 'CUSTOMER') {
          this.router.navigate(['/customer']);
        } else if (response.role === 'WAITER') {
          this.router.navigate(['/waiter']);
        } else if (response.role === 'CASHIER') {
          this.router.navigate(['/cashier']);
        } else {
          this.router.navigate(['']);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login failed:', error);
        this.isLoggingIn = false;
        
        if (error.status === 401) {
          this.loginError = 'Invalid username or password';
        } else {
          this.loginError = error.error?.message || 'Login failed. Please try again.';
        }
        
        this.snackBar.open(this.loginError, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loginWithGoogle() {
    // Implement Google Authentication logic here
    console.log("Google Sign-In Clicked");
    this.snackBar.open('Google login is not implemented yet', 'Close', {
      duration: 3000
    });
  }

  forgotPassword() {
    // Implement forgot password logic (navigate to reset page)
    console.log("Forgot Password Clicked");
    this.snackBar.open('Password reset functionality is not implemented yet', 'Close', {
      duration: 3000
    });
  }

  // Helper method to reset registration form
  private resetRegistrationForm() {
    this.user = {
      firstname: '',
      lastname: '',
      address: '',
      email: '',
      phone: '',
      username: '',
      password: ''
    };
  }
}