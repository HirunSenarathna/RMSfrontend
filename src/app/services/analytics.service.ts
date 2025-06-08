import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface CategorySalesDto {
  categoryName: string;
  percentage: number;
  revenue: number;
}

export interface MonthlySalesDto {
  month: string;
  categoryName: string;
  revenue: number;
}

export interface TopProductDto {
  productName: string;
  totalSales: number;
  revenue: number;
}

export interface DashboardAnalytics {
  categoryData: CategorySalesDto[];
  monthlyData: MonthlySalesDto[];
  topProductsData: TopProductDto[];
  totalCategories: number;
  totalCustomers: number;
  totalProductsSold: number;
  totalRevenue: number;
}

export interface SummaryData {
  totalCategories: number;
  totalCustomers: number;
  totalProductsSold: number;
  totalRevenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

   private baseUrl = 'http://localhost:8080/api/analytics'; // Adjust port as needed

  constructor(private http: HttpClient) {}

  getDashboardAnalytics(): Observable<DashboardAnalytics> {
    return this.http.get<DashboardAnalytics>(`${this.baseUrl}/dashboard`);
  }

  getSalesByCategory(): Observable<CategorySalesDto[]> {
    return this.http.get<CategorySalesDto[]>(`${this.baseUrl}/sales-by-category`);
  }

  getMonthlySales(months: number = 12): Observable<MonthlySalesDto[]> {
    return this.http.get<MonthlySalesDto[]>(`${this.baseUrl}/monthly-sales?months=${months}`);
  }

  getTopProducts(limit: number = 3): Observable<TopProductDto[]> {
    return this.http.get<TopProductDto[]>(`${this.baseUrl}/top-products?limit=${limit}`);
  }

   getSummaryData(): Observable<SummaryData> {
    return this.http.get<SummaryData>(`${this.baseUrl}/summary`);
  }

  getTotalCategories(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-categories`);
  }

  getTotalCustomers(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-customers`);
  }

  getTotalProductsSold(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-products-sold`);
  }

  getTotalRevenue(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-revenue`);
  }
}
