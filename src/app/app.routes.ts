import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuItemsComponent } from './components/menu-items/menu-items.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path:'Kotthu',component:MenuItemsComponent},
    { path: '**', redirectTo: '' }
];
