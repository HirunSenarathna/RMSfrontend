import { Routes } from '@angular/router';
import { HomeComponent } from './pages/customer/customer-dashboard/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { KottuComponent } from './pages/customer/kottu/kottu.component';
import { CheckoutComponent } from './pages/customer/checkout/checkout.component';
import { RiceAndCurryComponent } from './pages/customer/rice-and-curry/rice-and-curry.component';
import { DrinksComponent } from './pages/customer/drinks/drinks.component';
import { OwnerDashboardComponent } from './pages/owner/owner-dashboard/owner-dashboard.component';
import { CustomerManagementComponent } from './pages/owner/customer-management/customer-management.component';
import { EmployeeManagementComponent } from './pages/owner/employee-management/employee-management.component';
import { ProductManagementComponent } from './pages/owner/product-management/product-management.component';
import { OrderManagementComponent } from './pages/owner/order-management/order-management.component';
import { SalesManagementComponent } from './pages/owner/sales-management/sales-management.component';
import { WaiterDashboardComponent } from './pages/waiter/waiter-dashboard/waiter-dashboard.component';
import { WaiterProductManagementComponent } from './pages/waiter/waiter-product-management/waiter-product-management.component';
import { WaiterOrderManagementComponent } from './pages/waiter/waiter-order-management/waiter-order-management.component';
import { LargeOrdersComponent } from './components/waiter/large-orders/large-orders.component';
import { CashierOrderManagementComponent } from './pages/cashier/cashier-order-management/cashier-order-management.component';
import { OrderConfirmationComponent } from './pages/customer/order-confirmation/order-confirmation.component';
import { FriedRiceComponent } from './pages/customer/fried-rice/fried-rice.component';
import { ShortEatsComponent } from './pages/customer/short-eats/short-eats.component';
import { CashierDashboardComponent } from './pages/cashier/cashier-dashboard/cashier-dashboard.component';
import { NewOrderComponent } from './pages/cashier/new-order/new-order.component';
import { OnlineOrdersComponent } from './pages/cashier/online-orders/online-orders.component';
import { ViewPaymentsComponent } from './pages/cashier/view-payments/view-payments.component';
import { ViewOrdersComponent } from './pages/cashier/view-orders/view-orders.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { OrdersComponent } from './pages/customer/orders/orders.component';
import { OrderDetailsComponent } from './pages/customer/order-details/order-details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    

    
    {path:'owner',component:OwnerDashboardComponent},

    {path:'owner/customerManagement',component:CustomerManagementComponent},
    {path:'owner/employeeManagement',component:EmployeeManagementComponent},
    {path:'owner/productManagement',component:ProductManagementComponent},
    {path:'owner/OrderManagementComponent',component:OrderManagementComponent},
    {path:'owner/SalesManagementComponent',component:SalesManagementComponent},

    // {path:'waiter',component:WaiterDashboardComponent},
    {path:'waiter',component:WaiterProductManagementComponent},
    {path:'waiter/WaiterOrderManagement',component:WaiterOrderManagementComponent},
    {path:'waiter/LargeOrders',component:LargeOrdersComponent},

    {path:'cashier',component:CashierDashboardComponent},
    {path:'cashier/onlineOrders',component:OnlineOrdersComponent},
    {path:'cashier/viewOrders',component:ViewOrdersComponent},
    {path:'cashier/viewPayments',component:ViewPaymentsComponent},

    {path:'profile',component:UserProfileComponent},

    {path:'Kotthu',component:KottuComponent},
    {path:'FriedRice',component:FriedRiceComponent},
    {path: 'Rice&Curry',component:RiceAndCurryComponent},
    {path: 'ShortEats',component:ShortEatsComponent},
    {path:'Drinks', component:DrinksComponent},
    {path:'login',component:LoginComponent},
    {path:'cart',component:CartComponent},
    {path: 'checkout', component:CheckoutComponent},
    {path: 'orderConfirmation', component: OrderConfirmationComponent},
    {path: 'orders', component: OrdersComponent},
    {path: 'orderDetails/:id', component: OrderDetailsComponent},


    { path: '**', redirectTo: '' }
];
