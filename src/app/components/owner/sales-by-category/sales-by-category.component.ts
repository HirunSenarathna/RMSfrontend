import { Component,OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
import { AnalyticsService,CategorySalesDto  } from '../../../services/analytics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-by-category',
  imports: [ChartModule, CommonModule],
  templateUrl: './sales-by-category.component.html',
  styleUrl: './sales-by-category.component.css'
})
export class SalesByCategoryComponent implements OnInit {

  chart!: Chart;
  loading = true;
  error = '';

  // Color palette for categories
  private colorPalette = [
    '#044342', '#7e0505', '#ed9e20', '#6920fb', '#121212',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FCEA2B'
  ];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadCategoryData();
  }

  public loadCategoryData() {
    this.loading = true;
    this.error = '';

    this.analyticsService.getSalesByCategory().subscribe({
      next: (data: CategorySalesDto[]) => {
        this.createChart(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category sales:', error);
        this.error = 'Failed to load sales data';
        this.loading = false;
        // Create chart with default data on error
        this.createDefaultChart();
      }
    });
  }

  private createChart(data: CategorySalesDto[]) {
    const chartData = data.map((item, index) => ({
      name: item.categoryName,
      y: item.percentage,
      color: this.colorPalette[index % this.colorPalette.length]
    }));

    this.chart = new Chart({
      chart: {
        type: 'pie',
        height: 325
      },
      title: {
        text: 'Category wise sales'
      },
      series: [{
        type: 'pie',
        name: 'Revenue',
        data: chartData
      }],
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      }
    });
  }

  private createDefaultChart() {
    // Fallback chart with sample data
    this.chart = new Chart({
      chart: {
        type: 'pie',
        height: 325
      },
      title: {
        text: 'Category wise sales (Sample Data)'
      },
      series: [{
        type: 'pie',
        data: [
          { name: 'Kottu', y: 41.0, color: '#044342' },
          { name: 'Rice & Curry', y: 33.8, color: '#7e0505' },
          { name: 'Noodles', y: 6.5, color: '#ed9e20' },
          { name: 'Fried Rice', y: 15.2, color: '#6920fb' },
          { name: 'Biriyani', y: 3.5, color: '#121212' }
        ]
      }],
      credits: { enabled: false }
    });
  }

}
