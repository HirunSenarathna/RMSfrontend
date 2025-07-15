import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';


export interface CategorySalesDto {
  categoryName: string;
  percentage: number;
  revenue: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface MonthlySalesDto {
   month: string;
  categories: Record<string, number>; 
  total: number; 
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

   private baseUrl = 'http://localhost:8080/api/analytics'; 

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

  //
  getSalesByCategoryFiltered(filterType: string, filterValue: string): Observable<CategorySalesDto[]> {
    const params = new HttpParams()
      .set('filterType', filterType)
      .set('filterValue', filterValue);
    
    return this.http.get<CategorySalesDto[]>(`${this.baseUrl}/sales-by-category/filtered`, { params });
  }

  getSalesByCategoryByYear(year: string): Observable<CategorySalesDto[]> {
    return this.http.get<CategorySalesDto[]>(`${this.baseUrl}/sales-by-category/year/${year}`);
  }

  getSalesByCategoryByMonth(yearMonth: string): Observable<CategorySalesDto[]> {
    return this.http.get<CategorySalesDto[]>(`${this.baseUrl}/sales-by-category/month/${yearMonth}`);
  }

  getAvailableYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/available-years`);
  }

  // Helper methods for generating filter options
  getMonthOptions(year: number): FilterOption[] {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months.map((month, index) => ({
      value: `${year}-${(index + 1).toString().padStart(2, '0')}`,
      label: `${month} ${year}`
    }));
  }
}
