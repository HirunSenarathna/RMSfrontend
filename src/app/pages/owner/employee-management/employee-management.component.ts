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

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-employee-management',
  imports: [CommonModule, TableModule, Dialog, ButtonModule, ToastModule, ToolbarModule, ConfirmDialog, InputTextModule, TextareaModule, SelectModule, Tag, FormsModule, IconFieldModule, InputIconModule, TableModule],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.css',
  providers: [MessageService, ConfirmationService]
})


export class EmployeeManagementComponent implements OnInit {

  employeeDialog: boolean = false;
  employees!: Employee[];
  employee!: Employee;
  selectedEmployees!: Employee[] | null;
  submitted: boolean = false;
  statuses: any[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'On Leave', value: 'On Leave' }
  ];
  @ViewChild('dt') dt!: Table;
  cols!: Column[];

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployeeData();
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadEmployeeData() {
    // Simulating fetching employee data
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
      this.cd.markForCheck();
    });

    this.cols = [
      { field: 'profilePicture', header: 'Profile Picture' },
      { field: 'employeeId', header: 'Employee ID' },
      { field: 'name', header: 'Name' },
      { field: 'jobTitle', header: 'Job Title' },
      { field: 'department', header: 'Department' },
      { field: 'status', header: 'Status' }
    ];
  }

  openNew() {
    this.employee = {
      employeeId: undefined,
      name: undefined,
      jobTitle: undefined,
      department: undefined,
      email: undefined,
      phone: undefined,
      address: undefined,
      profilePicture: undefined,
      status: 'Active'  // Default to "Active"
    };
    this.submitted = false;
    this.employeeDialog = true;
  }

  editEmployee(employee: Employee) {
    this.employee = { ...employee };
    this.employeeDialog = true;
  }

  deleteSelectedEmployees() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected employees?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employees = this.employees.filter((val) => !this.selectedEmployees?.includes(val));
        this.selectedEmployees = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employees Deleted', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.employeeDialog = false;
    this.submitted = false;
  }

  deleteEmployee(employee: Employee) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${employee.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employees = this.employees.filter((val) => val.employeeId !== employee.employeeId);
        this.employee = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Deleted', life: 3000 });
      }
    });
  }

  saveEmployee() {
    this.submitted = true;

    if (this.employee.name?.trim()) {
      if (this.employee.employeeId) {
        // Update existing employee
        const index = this.employees.findIndex(emp => emp.employeeId === this.employee.employeeId);
        this.employees[index] = this.employee;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Updated', life: 3000 });
      } else {
        // Create new employee
        this.employee.employeeId = this.createId();
        this.employees.push(this.employee);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Added', life: 3000 });
      }

      this.employees = [...this.employees];
      this.employeeDialog = false;
      this.employee = {};
    }
  }

  createId(): string {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  getSeverity(status: string): 'success' | 'info' | 'danger' | 'warn' {
    switch (status) {
        case 'Active':
            return 'success';
        case 'Inactive':
            return 'danger';
        case 'Pending':
            return 'warn';
        default:
            return 'info';
    }
}

}
