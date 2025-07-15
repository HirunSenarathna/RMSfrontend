import { Component,OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
import { AnalyticsService,CategorySalesDto,FilterOption } from '../../../services/analytics.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-by-category',
  imports: [ChartModule, CommonModule,FormsModule],
  templateUrl: './sales-by-category.component.html',
  styleUrl: './sales-by-category.component.css'
})
export class SalesByCategoryComponent implements OnInit {

  chart!: Chart;
  loading = true;
  error = '';

  // Filter properties
  filterType = 'all'; // all, year, month, quarter, custom
  selectedYear = '';
  selectedMonth = '';
 
  startDate = '';
  endDate = '';

  // Options for dropdowns
  availableYears: number[] = [];
  monthOptions: FilterOption[] = [];
  quarterOptions: FilterOption[] = [];

  // Color palette for categories
  private colorPalette = [
    '#044342', '#7e0505', '#ed9e20', '#6920fb', '#121212',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FCEA2B'
  ];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAvailableYears();
    this.loadCategoryData();
  }

  private loadAvailableYears() {
    this.analyticsService.getAvailableYears().subscribe({
      next: (years) => {
        this.availableYears = years;
        if (years.length > 0) {
          this.selectedYear = years[0].toString();
          this.updateFilterOptions();
        }
      },
      error: (error) => {
        console.error('Error loading available years:', error);
        // Set current year as fallback
        const currentYear = new Date().getFullYear();
        this.availableYears = [currentYear];
        this.selectedYear = currentYear.toString();
        this.updateFilterOptions();
      }
    });
  }

  private updateFilterOptions() {
    if (this.selectedYear) {
      const year = parseInt(this.selectedYear);
      this.monthOptions = this.analyticsService.getMonthOptions(year);
      
      
      // Set default selections
      if (this.monthOptions.length > 0) {
        this.selectedMonth = this.monthOptions[0].value;
      }
      
    }
  }

  onFilterTypeChange() {
    this.loadCategoryData();
  }

  onYearChange() {
    this.updateFilterOptions();
    if (this.filterType === 'year') {
      this.loadCategoryData();
    }
  }

  onMonthChange() {
    if (this.filterType === 'month') {
      this.loadCategoryData();
    }
  }

  onQuarterChange() {
    if (this.filterType === 'quarter') {
      this.loadCategoryData();
    }
  }

  onDateRangeChange() {
    if (this.filterType === 'custom' && this.startDate && this.endDate) {
      this.loadCategoryData();
    }
  }

  public loadCategoryData() {
    this.loading = true;
    this.error = '';
    

    let dataObservable;

    switch (this.filterType) {
      case 'year':
        if (!this.selectedYear) return;
        dataObservable = this.analyticsService.getSalesByCategoryByYear(this.selectedYear);
        break;
      case 'month':
        if (!this.selectedMonth) return;
        dataObservable = this.analyticsService.getSalesByCategoryByMonth(this.selectedMonth);
        break;
      
      case 'custom':
        if (!this.startDate || !this.endDate) return;
        const dateRange = `${this.startDate},${this.endDate}`;
        dataObservable = this.analyticsService.getSalesByCategoryFiltered('daterange', dateRange);
        break;
      default:
        dataObservable = this.analyticsService.getSalesByCategory();
    }

    dataObservable.subscribe({
      next: (data: CategorySalesDto[]) => {
        this.createChart(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category sales:', error);
        this.error = 'Failed to load sales data';
        this.loading = false;
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

    const titleText = this.getChartTitle();

    this.chart = new Chart({
      chart: {
        type: 'pie',
        height: 325
      },
      title: {
        text: titleText
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
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      }
    });
  }

  private getChartTitle(): string {
    switch (this.filterType) {
      case 'year':
        return `Category Sales - ${this.selectedYear}`;
      case 'month':
        const monthOption = this.monthOptions.find(m => m.value === this.selectedMonth);
        return `Category Sales - ${monthOption?.label || this.selectedMonth}`;
      
      case 'custom':
        return `Category Sales - ${this.startDate} to ${this.endDate}`;
      default:
        return 'Category wise sales (All Time)';
    }
  }

  private createDefaultChart() {
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

  // chart!: Chart;
  // loading = true;
  // error = '';

  // // Color palette for categories
  // private colorPalette = [
  //   '#044342', '#7e0505', '#ed9e20', '#6920fb', '#121212',
  //   '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FCEA2B'
  // ];

  // constructor(private analyticsService: AnalyticsService) {}

  // ngOnInit() {
  //   this.loadCategoryData();
  // }

  // public loadCategoryData() {
  //   this.loading = true;
  //   this.error = '';

  //   this.analyticsService.getSalesByCategory().subscribe({
  //     next: (data: CategorySalesDto[]) => {
  //       this.createChart(data);
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       console.error('Error loading category sales:', error);
  //       this.error = 'Failed to load sales data';
  //       this.loading = false;
  //       // Create chart with default data on error
  //       this.createDefaultChart();
  //     }
  //   });
  // }

  // private createChart(data: CategorySalesDto[]) {
  //   const chartData = data.map((item, index) => ({
  //     name: item.categoryName,
  //     y: item.percentage,
  //     color: this.colorPalette[index % this.colorPalette.length]
  //   }));

  //   this.chart = new Chart({
  //     chart: {
  //       type: 'pie',
  //       height: 325
  //     },
  //     title: {
  //       text: 'Category wise sales'
  //     },
  //     series: [{
  //       type: 'pie',
  //       name: 'Revenue',
  //       data: chartData
  //     }],
  //     credits: {
  //       enabled: false
  //     },
  //     tooltip: {
  //       pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  //     }
  //   });
  // }

  // private createDefaultChart() {
  //   // Fallback chart with sample data
  //   this.chart = new Chart({
  //     chart: {
  //       type: 'pie',
  //       height: 325
  //     },
  //     title: {
  //       text: 'Category wise sales (Sample Data)'
  //     },
  //     series: [{
  //       type: 'pie',
  //       data: [
  //         { name: 'Kottu', y: 41.0, color: '#044342' },
  //         { name: 'Rice & Curry', y: 33.8, color: '#7e0505' },
  //         { name: 'Noodles', y: 6.5, color: '#ed9e20' },
  //         { name: 'Fried Rice', y: 15.2, color: '#6920fb' },
  //         { name: 'Biriyani', y: 3.5, color: '#121212' }
  //       ]
  //     }],
  //     credits: { enabled: false }
  //   });
  // }

}
