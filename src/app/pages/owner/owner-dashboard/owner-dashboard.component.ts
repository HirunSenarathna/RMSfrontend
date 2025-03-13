import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TopWidgetComponent } from '../../../components/owner/top-widget/top-widget.component';
import { TopThreeProductsComponent } from '../../../components/owner/top-three-products/top-three-products.component';
import { SalesByMonthComponent } from '../../../components/owner/sales-by-month/sales-by-month.component';
import { SalesByCategoryComponent } from '../../../components/owner/sales-by-category/sales-by-category.component';
import { LastFewTransactionsComponent } from '../../../components/owner/last-few-transactions/last-few-transactions.component';

@Component({
  selector: 'app-owner-dashboard',
  imports: [RouterModule, CommonModule,TopWidgetComponent,TopThreeProductsComponent,SalesByMonthComponent,SalesByCategoryComponent,LastFewTransactionsComponent],
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.css'
})
export class OwnerDashboardComponent {
  

}