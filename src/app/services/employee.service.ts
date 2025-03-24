import { Injectable } from '@angular/core';
import { Employee } from '../domain/employee';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
     // Sample data for employees
      private employees: Employee[] = [
        {
          employeeId: 'EMP001',
          name: 'John Doe',
          jobTitle: 'Software Engineer',
          department: 'IT',
          email: 'john.doe@example.com',
          phone: '123-456-7890',
          address: '123 Main St, Springfield, IL',
          profilePicture: 'assets/pi1.avif',
          status: 'Active'
        },
        {
          employeeId: 'EMP002',
          name: 'Jane Smith',
          jobTitle: 'Project Manager',
          department: 'Operations',
          email: 'jane.smith@example.com',
          phone: '987-654-3210',
          address: '456 Elm St, Springfield, IL',
          profilePicture: 'assets/pi1.avif',
          status: 'On Leave'
        },
        {
          employeeId: 'EMP003',
          name: 'Michael Johnson',
          jobTitle: 'HR Specialist',
          department: 'Human Resources',
          email: 'michael.johnson@example.com',
          phone: '555-123-4567',
          address: '789 Oak St, Springfield, IL',
          profilePicture: 'assets/pi1.avif',
          status: 'Inactive'
        }
      ];
    
      constructor() {}
    
    
  // Get all employees
  getEmployees(): Observable<Employee[]> {
    return of(this.employees);
  }

  // Get a single employee by ID
  getEmployeeById(employeeId: string): Observable<Employee | undefined> {
    const employee = this.employees.find(emp => emp.employeeId === employeeId);
    return of(employee);
  }

  // Add a new employee
  addEmployee(employee: Employee): Observable<Employee> {
    employee.employeeId = this.generateEmployeeId();
    this.employees.push(employee);
    return of(employee);
  }

  // Update an existing employee
  updateEmployee(updatedEmployee: Employee): Observable<Employee | null> {
    const index = this.employees.findIndex(emp => emp.employeeId === updatedEmployee.employeeId);
    if (index !== -1) {
      this.employees[index] = updatedEmployee;
      return of(updatedEmployee);
    }
    return of(null);
  }

  // Delete an employee by ID
  deleteEmployee(employeeId: string): Observable<boolean> {
    const initialLength = this.employees.length;
    this.employees = this.employees.filter(emp => emp.employeeId !== employeeId);
    return of(this.employees.length < initialLength);
  }

  // Helper method to generate a unique employee ID
  private generateEmployeeId(): string {
    return 'EMP' + Math.floor(1000 + Math.random() * 9000);
  }
}
