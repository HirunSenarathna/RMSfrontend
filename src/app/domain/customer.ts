export interface Customer {
    // id: string;           
    // name: string;         
    // email: string;        
    // phone: string;        
    // address: string; 
    // profilePicture?: string;     

    id: string;
    firstname: string;
    lastname: string;
    name?: string; // Combined firstname + lastname for display purposes
    email: string;
    phone: string;
    address: string;
    username?: string;
    profilePicture?: string;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
}