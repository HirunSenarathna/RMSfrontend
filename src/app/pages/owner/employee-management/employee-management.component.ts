import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ConfirmationService, MessageService } from 'primeng/api';

import { Employee } from '../../../domain/employee';
import { EmployeeService } from '../../../services/employee.service';

import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-employee-management',
  imports: [CommonModule, TableModule, Dialog, ButtonModule, ToastModule, ToolbarModule, ConfirmDialog, InputTextModule, TextareaModule, SelectModule, Tag, FormsModule, IconFieldModule, InputIconModule, TableModule,DropdownModule,CalendarModule,ReactiveFormsModule],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.css',
  providers: [MessageService, ConfirmationService]
})


export class EmployeeManagementComponent implements OnInit {

  employeeDialog: boolean = false;
  employees: Employee[] = [];
  employee!: Employee;
  submitted: boolean = false;
  employeeForm!: FormGroup;
  isEditMode: boolean = false;
  roles = [
    { label: 'Owner', value: 'OWNER' },
    { label: 'Waiter', value: 'WAITER' },
    { label: 'Cashier', value: 'CASHIER' }
  ];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadEmployeeData();
    this.initForm();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      password: ['', [Validators.minLength(8)]],
      dateOfBirth: ['', Validators.required],
      idCardNumber: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  loadEmployeeData() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.cd.markForCheck();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load employees', life: 3000 });
        console.error('Error loading employees:', err);
      }
    });

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'firstname', header: 'First Name' },
      { field: 'lastname', header: 'Last Name' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Phone' },
      { field: 'username', header: 'Username' },
      { field: 'role', header: 'Role' },
      { field: 'idCardNumber', header: 'ID Card Number' }
    ];
  }

  openNew() {
    this.employee = {} as Employee;
    this.employeeForm.reset();
    this.employeeForm.patchValue({ role: 'WAITER' }); // Default role
    this.submitted = false;
    this.employeeDialog = true;
    this.isEditMode = false;
  }

  editEmployee(employee: Employee) {
    this.employee = { ...employee };
    this.employeeForm.patchValue({
      firstname: employee.firstname,
      lastname: employee.lastname,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      username: employee.username,
      password: '', // Don't set password for editing
      dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth) : null,
      idCardNumber: employee.idCardNumber,
      role: employee.role
    });
    this.employeeDialog = true;
    this.isEditMode = true;
  }

  deleteEmployee(employee: Employee) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${employee.firstname} ${employee.lastname}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (employee.id) {
          this.employeeService.deleteEmployee(employee.id).subscribe({
            next: () => {
              this.employees = this.employees.filter(val => val.id !== employee.id);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Deleted', life: 3000 });
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete employee', life: 3000 });
              console.error('Error deleting employee:', err);
            }
          });
        }
      }
    });
  }

  hideDialog() {
    this.employeeDialog = false;
    this.submitted = false;
    this.employeeForm.reset();
  }

  saveEmployee() {
    this.submitted = true;

    if (this.employeeForm.invalid) {
      return;
    }

    const employeeData = this.employeeForm.value;

    if (this.isEditMode && this.employee.id) {
      // If it's edit mode and password is empty, remove it from the request
      if (!employeeData.password) {
        delete employeeData.password;
      }


      // Update employee
      this.employeeService.updateEmployee(this.employee.id, employeeData).subscribe({
        next: (result) => {
          const index = this.findIndexById(this.employee.id!);
          if (index !== -1) {
            this.employees[index] = result;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Updated', life: 3000 });
          }
          this.employeeDialog = false;
          this.employeeForm.reset();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to update employee', life: 3000 });
          console.error('Error updating employee:', err);
        }
      });
    } else {
      this.employeeService.addEmployee(employeeData).subscribe({
        next: (result) => {
          this.employees.push(result);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Created', life: 3000 });
          this.employeeDialog = false;
          this.employeeForm.reset();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to create employee', life: 3000 });
          console.error('Error creating employee:', err);
        }
      });
    }
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  findIndexById(id: number): number {
    return this.employees.findIndex(employee => employee.id === id);
  }

  getSeverity(role: string): 'success' | 'info' | 'danger' {
    switch (role) {
      case 'OWNER':
        return 'success';
      case 'WAITER':
        return 'info';
      case 'CASHIER':
        return 'info';
      default:
        return 'danger';
    }
  }

}
