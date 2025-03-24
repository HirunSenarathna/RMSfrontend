import { Injectable } from '@angular/core';
  // rxjs 'of' to return observable data
import { Customer } from '../domain/customer';
import { of, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // Sample data for customers
  private customers: Customer[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@.com',
      phone: '123-456-7890',
      address: '123 Main St, Springfield, IL',
      profilePicture: 'assets/pi1.avif'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '987-654-3210',
      address: '456 Elm St, Springfield, IL',
      profilePicture: 'assets/pi1.avif'
    },
    {
      id: '',
      name: 'ane Smith',
      email: 'jane.smith@example.com',
      phone: '987-654-3210',
      address: '456 Elm St, Springfield, IL',
      profilePicture: 'assets/pi1.avif'
    }
  ];

  constructor() {}

  // Method to get all customers
  getCustomers(): Observable<Customer[]> {
    return of(this.customers);  // Return the mock customers as an observable
  }

  // Method to get a specific customer by ID
  getCustomerById(id: string): Observable<Customer | undefined> {
    const customer = this.customers.find((c) => c.id === id);
    return of(customer);  // Return the customer or undefined if not found
  }
}
