import { Routes } from '@angular/router';
import { HomeComponent } from './pages/customer/customer-dashboard/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { KottuComponent } from './pages/customer/kottu/kottu.component';
import { CheckoutComponent } from './pages/customer/checkout/checkout.component';
import { RiceAndCurryComponent } from './pages/customer/rice-and-curry/rice-and-curry.component';
import { DrinksComponent } from './pages/customer/drinks/drinks.component';
import { OwnerDashboardComponent } from './pages/owner/owner-dashboard/owner-dashboard.component';
import { CustomerManagementComponent } from './pages/owner/customer-management/customer-management.component';
import { EmployeeManagementComponent } from './pages/owner/employee-management/employee-management.component';
import { ProductManagementComponent } from './pages/owner/product-management/product-management.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    
    {path:'owner',component:OwnerDashboardComponent},

    {path:'owner/customerManagement',component:CustomerManagementComponent},
    {path:'owner/employeeManagement',component:EmployeeManagementComponent},
    {path:'owner/productManagement',component:ProductManagementComponent},


    {path:'Kotthu',component:KottuComponent},
    {path: 'Rice&Curry',component:RiceAndCurryComponent},
    {path:'Drinks', component:DrinksComponent},
    {path:'profile',component:LoginComponent},
    {path:'cart',component:CartComponent},
    {path: 'checkout', component:CheckoutComponent},


    { path: '**', redirectTo: '' }
];
