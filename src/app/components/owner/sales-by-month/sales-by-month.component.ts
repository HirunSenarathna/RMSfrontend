import { Component,OnInit  } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
import { AnalyticsService,MonthlySalesDto   } from '../../../services/analytics.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-sales-by-month',
  imports: [ChartModule,CommonModule,MatIcon,MatProgressSpinnerModule,MatButtonModule,MatCardModule],
  templateUrl: './sales-by-month.component.html',
  styleUrl: './sales-by-month.component.css'
})
export class SalesByMonthComponent implements OnInit {
   chart!: Chart;
  loading = true;
  error = '';
  totalRevenue: number = 0;
  chartType: 'line' | 'column' | 'area' = 'area';

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
        this.processDataAndCreateChart(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading monthly sales:', error);
        this.error = 'Failed to load monthly sales data';
        this.loading = false;
        this.createSampleChart();
      }
    });
  }

  private processDataAndCreateChart(data: MonthlySalesDto[]) {
    // Sort data by month
    const sortedData = this.sortDataByMonth(data);
    
    // Extract monthly totals and labels
    const monthlyTotals = sortedData.map(item => item.total || 0);
    const monthLabels = sortedData.map(item => this.formatMonthLabel(item.month));

    // Calculate total revenue
    this.totalRevenue = monthlyTotals.reduce((sum, val) => sum + val, 0);

    this.createTotalSalesChart(monthlyTotals, monthLabels);
  }

  private sortDataByMonth(data: MonthlySalesDto[]): MonthlySalesDto[] {
    return data.sort((a, b) => {
      const dateA = new Date(a.month + '-01');
      const dateB = new Date(b.month + '-01');
      return dateA.getTime() - dateB.getTime();
    });
  }

  private formatMonthLabel(monthStr: string): string {
    try {
      const [year, month] = monthStr.split('-');
      const monthIndex = parseInt(month) - 1;
      return `${this.months[monthIndex]} ${year}`;
    } catch {
      return monthStr;
    }
  }

  private createTotalSalesChart(data: number[], categories: string[]) {
    const chartConfig: any = {
      chart: {
        type: this.chartType,
        height: 500,
        backgroundColor: 'transparent'
      },
      title: {
        text: 'Monthly Total Sales',
        style: {
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1f2937'
        }
      },
      subtitle: {
        text: `Total Revenue: Rs. ${this.totalRevenue.toLocaleString()}`,
        style: {
          fontSize: '18px',
          color: '#6b7280'
        }
      },
      xAxis: {
        categories: categories,
        labels: {
          style: {
            fontSize: '14px',
            color: '#374151'
          }
        },
        gridLineWidth: 0
      },
      yAxis: {
        title: {
          text: 'Revenue (Rs.)',
          style: {
            fontSize: '16px',
            color: '#374151'
          }
        },
        labels: {
          formatter: function(): string {
            return 'Rs. ' + ((this as any).value as number).toLocaleString();
          },
          style: {
            fontSize: '14px',
            color: '#374151'
          }
        },
        gridLineColor: '#e5e7eb'
      },
      tooltip: {
        backgroundColor: 'white',
        borderColor: '#d1d5db',
        borderRadius: 8,
        shadow: true,
        formatter: function(): string {
          return `<b>${(this as any).x}</b><br/>Revenue: Rs. ${((this as any).y as number).toLocaleString()}`;
        }
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, 'rgba(59, 130, 246, 0.4)'],
              [1, 'rgba(59, 130, 246, 0.1)']
            ]
          },
          marker: {
            radius: 8,
            fillColor: '#3b82f6',
            lineColor: '#ffffff',
            lineWidth: 3
          },
          lineWidth: 4,
          lineColor: '#3b82f6'
        },
        line: {
          marker: {
            radius: 8,
            fillColor: '#3b82f6',
            lineColor: '#ffffff',
            lineWidth: 3
          },
          lineWidth: 4,
          color: '#3b82f6'
        },
        column: {
          color: '#3b82f6',
          borderRadius: 6,
          borderWidth: 0,
          dataLabels: {
            enabled: false
          }
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Monthly Sales',
        data: data,
        color: '#3b82f6'
      }],
      credits: {
        enabled: false
      }
    };

    this.chart = new Chart(chartConfig);
  }

  private createSampleChart() {
    const sampleData = [85000, 92000, 78000, 105000, 118000, 125000, 
                       135000, 128000, 115000, 108000, 95000, 142000];
    const sampleCategories = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 
                             'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 
                             'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'];
    
    this.totalRevenue = sampleData.reduce((sum, val) => sum + val, 0);
    this.createTotalSalesChart(sampleData, sampleCategories);
  }

  changeChartType(type: 'line' | 'column' | 'area') {
    this.chartType = type;
    this.loadMonthlyData(); // Reload to apply new chart type
  }


}
