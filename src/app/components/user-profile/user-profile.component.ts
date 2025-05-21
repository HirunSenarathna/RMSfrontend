import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { AuthService, User } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { CustomerService } from '../../services/customer.service';
import { CalendarModule } from 'primeng/calendar';



@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, CardModule, DividerModule, ButtonModule, ReactiveFormsModule, InputTextModule, ToastModule,CalendarModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  providers: [MessageService]
})
export class UserProfileComponent implements OnInit {
currentUser: User | null = null;
  profileForm!: FormGroup;
  editMode: boolean = false;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.initializeForm();
    });
  }

  initializeForm() {
    if (this.currentUser) {
      const isEmployee = this.currentUser.userType === 'employee';
      this.profileForm = this.fb.group({
        firstname: [this.currentUser.firstname, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        lastname: [this.currentUser.lastname, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        email: [this.currentUser.email, [Validators.required, Validators.email]],
        phone: [this.currentUser.phone, [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
        username: [{ value: this.currentUser.username, disabled: true }],
        address: [this.currentUser.address || '', Validators.required],
        role: [{ value: this.currentUser.role || '', disabled: true }],
        dateOfBirth: [
          { value: this.currentUser.dateOfBirth ? new Date(this.currentUser.dateOfBirth) : null, disabled: true },
          isEmployee ? Validators.required : []
        ],
        idCardNumber: [
          { value: this.currentUser.idCardNumber || '', disabled: true },
          isEmployee ? Validators.required : []
        ],
        password: ['', [Validators.minLength(8)]]
      });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.initializeForm();
    }
  }

  saveProfile() {
    if (this.profileForm.valid && this.currentUser?.id) {
      const formValue = this.profileForm.getRawValue();
      const requestPayload = {
        firstname: formValue.firstname,
        lastname: formValue.lastname,
        email: formValue.email,
        phone: formValue.phone,
        address: formValue.address,
        username: this.currentUser.username,
        role: this.currentUser.userType === 'employee' ? this.currentUser.role : 'CUSTOMER',
        dateOfBirth: this.currentUser.dateOfBirth, 
        idCardNumber: this.currentUser.idCardNumber, 
        password: formValue.password || undefined
      };

      if (this.currentUser.userType === 'employee') {
        this.employeeService.updateEmployee(this.currentUser.id, requestPayload).subscribe({
          next: (updatedEmployee) => {
            this.authService.updateCurrentUser({
              ...this.currentUser,
              ...formValue,
              dateOfBirth: this.currentUser?.dateOfBirth,
              idCardNumber: this.currentUser?.idCardNumber
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Profile Updated',
              detail: 'Your profile information has been successfully updated'
            });
            this.editMode = false;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Update Failed',
              detail: err.error?.message || 'Failed to update profile'
            });
          }
        });
      } else if (this.currentUser.userType === 'customer') {
        this.customerService.updateCustomer(this.currentUser.id, requestPayload).subscribe({
          next: (updatedCustomer) => {
            this.authService.updateCurrentUser({
              ...this.currentUser,
              ...formValue,
              dateOfBirth: this.currentUser?.dateOfBirth,
              idCardNumber: this.currentUser?.idCardNumber
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Profile Updated',
              detail: 'Your profile information has been successfully updated'
            });
            this.editMode = false;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Update Failed',
              detail: err.error?.message || 'Failed to update profile'
            });
          }
        });
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please fill in all required fields correctly'
      });
    }
  }

  goBack() {
    const role = this.currentUser?.role?.toLowerCase();
    switch (role) {
      case 'owner':
        this.router.navigate(['/owner']);
        break;
      case 'cashier':
        this.router.navigate(['/cashier']);
        break;
      case 'waiter':
        this.router.navigate(['/waiter']);
        break;
      case 'customer':
        this.router.navigate(['/']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
