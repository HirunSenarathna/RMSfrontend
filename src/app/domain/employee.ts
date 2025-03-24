export interface Employee {
    employeeId?: string;
    name?: string;
    jobTitle?: string;
    department?: string;
    email?: string;
    phone?: string;
    address?: string;
    profilePicture?: string;
    status?: 'Active' | 'Inactive' | 'On Leave';
}