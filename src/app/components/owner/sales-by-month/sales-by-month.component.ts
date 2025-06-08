import { Component,OnInit  } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
import { AnalyticsService,MonthlySalesDto   } from '../../../services/analytics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-by-month',
  imports: [ChartModule,CommonModule],
  templateUrl: './sales-by-month.component.html',
  styleUrl: './sales-by-month.component.css'
})
export class SalesByMonthComponent implements OnInit {

 chart!: Chart;
  loading = true;
  error = '';

  private categoryColors: { [key: string]: string } = {
    'Kottu': '#044342',
    'Rice & Curry': '#7e0505',
    'Noodles': '#ed9e20',
    'Fried Rice': '#6920fb',
    'Biriyani': '#121212'
  };

  private months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadMonthlyData();
  }

  public loadMonthlyData() {
    this.loading = true;
    this.error = '';

    this.analyticsService.getMonthlySales(12).subscribe({
      next: (data: MonthlySalesDto[]) => {
        this.createChart(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading monthly sales:', error);
        this.error = 'Failed to load monthly sales data';
        this.loading = false;
        this.createDefaultChart();
      }
    });
  }

  private createChart(data: MonthlySalesDto[]) {
    // Group data by category
    const groupedData: { [category: string]: number[] } = {};
    
    // Initialize all categories with zeros for all months
    const categories = [...new Set(data.map(item => item.categoryName))];
    categories.forEach(category => {
      groupedData[category] = new Array(12).fill(0);
    });

    // Fill in the actual data
    data.forEach(item => {
      const monthIndex = this.getMonthIndex(item.month);
      if (monthIndex !== -1) {
        groupedData[item.categoryName][monthIndex] = item.revenue;
      }
    });

    // Create series for chart
    const series = Object.keys(groupedData).map(category => ({
      name: category,
      type: 'line' as const,
      color: this.categoryColors[category] || '#000000',
      data: groupedData[category]
    }));

    this.chart = new Chart({
      chart: {
        type: 'line',
        height: 325
      },
      title: {
        text: 'Month wise sales'
      },
      xAxis: {
        categories: this.months
      },
      yAxis: {
        title: {
          text: 'Revenue in Rs.'
        }
      },
      series: series,
      credits: {
        enabled: false
      }
    });
  }

  private getMonthIndex(monthStr: string): number {
    // Handle different month formats (full name, short name, number)
    const month = monthStr.toLowerCase();
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                       'july', 'august', 'september', 'october', 'november', 'december'];
    const shortNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                       'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    let index = monthNames.indexOf(month);
    if (index === -1) {
      index = shortNames.indexOf(month);
    }
    if (index === -1 && !isNaN(Number(month))) {
      index = Number(month) - 1; // Convert 1-based to 0-based
    }
    
    return index;
  }

  private createDefaultChart() {
    // Fallback chart with sample data
    this.chart = new Chart({
      chart: {
        type: 'line',
        height: 325
      },
      title: {
        text: 'Month wise sales (Sample Data)'
      },
      xAxis: {
        categories: this.months
      },
      yAxis: {
        title: {
          text: 'Revenue in Rs.'
        }
      },
      series: [
        {
          name: "Kottu",
          type: "line",
          color: '#044342',
          data: [70, 69, 95, 145, 182, 215, 252, 265, 233, 183, 139, 196]
        },
        {
          name: 'Rice & Curry',
          type: 'line',
          color: '#7e0505',
          data: [47, 52, 44, 35, 58, 69, 32, 53, 71, 82, 99, 159]
        },
        {
          name: 'Noodles',
          type: 'line',
          color: '#ed9e20',
          data: [17, 22, 14, 25, 18, 19, 22, 43, 11, 32, 29, 59]
        }
      ],
      credits: {
        enabled: false
      }
    });
  }


}
