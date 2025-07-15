import { Component,OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AnalyticsService,SummaryData  } from '../../../services/analytics.service';

@Component({
  selector: 'app-top-widget',
  imports: [CommonModule],
  templateUrl: './top-widget.component.html',
  styleUrl: './top-widget.component.css'
})
export class TopWidgetComponent implements OnInit, OnDestroy {
   summaryData: SummaryData = {
    totalCategories: 0,
    totalCustomers: 0,
    totalProductsSold: 0,
    totalRevenue: 0
  };

  loading = true;
  error = false;
  private subscription: Subscription = new Subscription();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadSummaryData();
    
    //Auto-refresh every 30 seconds
    this.subscription.add(
      interval(30000)
        .pipe(switchMap(() => this.analyticsService.getSummaryData()))
        .subscribe({
          next: (data) => {
            this.summaryData = data;
          },
          error: (error) => {
            console.error('Error refreshing summary data:', error);
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadSummaryData(): void {
    this.loading = true;
    this.error = false;

    this.subscription.add(
      this.analyticsService.getSummaryData().subscribe({
        next: (data) => {
          this.summaryData = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading summary data:', error);
          this.error = true;
          this.loading = false;
        }
      })
    );
  }

  formatRevenue(revenue: number): string {
    if (revenue >= 1000000) {
      return (revenue / 1000000).toFixed(1) + 'M';
    } else if (revenue >= 1000) {
      return (revenue / 1000).toFixed(1) + 'K';
    }
    return revenue.toFixed(0);
  }

  retryLoad(): void {
    this.loadSummaryData();
  }

}
