import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { KottuComponent } from './pages/kottu/kottu.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path:'Kotthu',component:KottuComponent},
    {path:'profile',component:LoginComponent},
    {path:'cart',component:CartComponent},
    {path: 'checkout', component:CheckoutComponent},
    { path: '**', redirectTo: '' }
];
