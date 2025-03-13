import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';

@Component({
  selector: 'app-top-three-products',
  imports: [ChartModule],
  templateUrl: './top-three-products.component.html',
  styleUrl: './top-three-products.component.css'
})
export class TopThreeProductsComponent {

  chart = new Chart({
    chart: {
      type: 'bar',
      height: 225
    },
    title: {
      text: 'Top 3 Products'
    },
    xAxis: {
      categories: [
        'kottu',
        'Fried Rice',
        'Rice & Curry',
      ]
    },
    yAxis: {
      title: {
        text: ''
      }
    },
    series: [
     {
      type: 'bar',
      showInLegend: false,
      data: [
        {
          name: 'kottu',
          y: 395,
          color: '#044342',
        },
        {
          name: 'Rice & Curry',
          y: 385,
          color: '#7e0505',
        },
        {
          name: 'Fried Rice',
          y: 275,
          color: '#ed9e20',
        },
      ]
     }
    ],
    credits: {
      enabled: false
    }
  })
  

}
