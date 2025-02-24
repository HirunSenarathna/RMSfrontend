import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { KottuComponent } from './pages/kottu/kottu.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { RiceAndCurryComponent } from './pages/rice-and-curry/rice-and-curry.component';
import { DrinksComponent } from './pages/drinks/drinks.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path:'Kotthu',component:KottuComponent},
    {path: 'Rice&Curry',component:RiceAndCurryComponent},
    {path:'Drinks', component:DrinksComponent},
    {path:'profile',component:LoginComponent},
    {path:'cart',component:CartComponent},
    {path: 'checkout', component:CheckoutComponent},
    { path: '**', redirectTo: '' }
];
