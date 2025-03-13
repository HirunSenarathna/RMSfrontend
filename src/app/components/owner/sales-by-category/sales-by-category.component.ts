import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';

@Component({
  selector: 'app-sales-by-category',
  imports: [ChartModule],
  templateUrl: './sales-by-category.component.html',
  styleUrl: './sales-by-category.component.css'
})
export class SalesByCategoryComponent {

  chart = new Chart({
    chart: {
      type: 'pie',
      height: 325
    },
    title: {
      text: 'Category wise sales'
    },
    xAxis: {
      categories: [
        'Kottu',
        'Fried Rice',
        'Biriyani',
        'Noodles',
        'Rice & Curry'
      ]
    },
    yAxis: {
      title: {
        text: 'Revenue in %'
      }
    },
    series: [
     {
      type: 'pie',
      data: [
        {
          name: 'Kottu',
          y: 41.0,
          color: '#044342',
        },
        {
          name: 'Rice & Curry',
          y: 33.8,
          color: '#7e0505',
        },
        {
          name: 'Noodles',
          y: 6.5,
          color: '#ed9e20',
        },
        {
          name: 'Fried Rice',
          y: 15.2,
          color: '#6920fb',
        },
        {
          name: 'Biriyani',
          y: 3.5,
          color: '#121212',
        },
      ]
     }
    ],
    credits: {
      enabled: false
    }
  })

}
