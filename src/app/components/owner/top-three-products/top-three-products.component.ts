import { Component,OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
import { AnalyticsService,TopProductDto   } from '../../../services/analytics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-three-products',
  imports: [ChartModule,CommonModule],
  templateUrl: './top-three-products.component.html',
  styleUrl: './top-three-products.component.css'
})
export class TopThreeProductsComponent implements OnInit {
 chart!: Chart;
  loading = true;
  error = '';

  // Color palette for products
  private colorPalette = ['#044342', '#7e0505', '#ed9e20', '#6920fb', '#121212'];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadTopProductsData();
  }

  public loadTopProductsData() {
    this.loading = true;
    this.error = '';

    this.analyticsService.getTopProducts(3).subscribe({
      next: (data: TopProductDto[]) => {
        this.createChart(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading top products:', error);
        this.error = 'Failed to load top products data';
        this.loading = false;
        this.createDefaultChart();
      }
    });
  }

  private createChart(data: TopProductDto[]) {
    const chartData = data.map((item, index) => ({
      name: item.productName,
      y: item.totalSales,
      color: this.colorPalette[index % this.colorPalette.length]
    }));

    const categories = data.map(item => item.productName);

    this.chart = new Chart({
      chart: {
        type: 'bar',
        height: 225
      },
      title: {
        text: 'Top Products'
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: {
          text: 'Sales Count'
        }
      },
      series: [{
        type: 'bar',
        showInLegend: false,
        data: chartData
      }],
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: 'Sales: <b>{point.y}</b>'
      }
    });
  }

  private createDefaultChart() {
    // Fallback chart with sample data
    this.chart = new Chart({
      chart: {
        type: 'bar',
        height: 225
      },
      title: {
        text: 'Top 3 Products (Sample Data)'
      },
      xAxis: {
        categories: ['Kottu', 'Fried Rice', 'Rice & Curry']
      },
      yAxis: {
        title: {
          text: 'Sales Count'
        }
      },
      series: [{
        type: 'bar',
        showInLegend: false,
        data: [
          { name: 'Kottu', y: 395, color: '#044342' },
          { name: 'Rice & Curry', y: 385, color: '#7e0505' },
          { name: 'Fried Rice', y: 275, color: '#ed9e20' }
        ]
      }],
      credits: { enabled: false }
    });
  }

}
