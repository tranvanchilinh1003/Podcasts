import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoriesService } from 'app/@core/services/apis/categories.service';
import { CommentService } from 'app/@core/services/apis/comment.service';
import { CustomerService } from 'app/@core/services/apis/customers.service';
import { PostService } from 'app/@core/services/apis/post.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: new Array(12).fill(0), label: 'Số lượng khách hàng' },
    { data: new Array(12).fill(0), label: 'Số lượng bài đăng' }
  ];
  public lineChartLabels: Label[] = new Array(12).fill('').map((_, index) => `Tháng ${index + 1}`);
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: [{ ticks: { beginAtZero: true } }]
    }
  };
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  chartColor: Color[] = [
    {
      borderColor: 'rgba(255, 206, 86, 1)',
      backgroundColor: 'rgba(255, 206, 86, 0.4)',
    },
    {
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.4)',
    }
  ];
  private customerStatsSubscription: Subscription;

  chartData: any[] = [];
  chartLabels: any[] = [];
  chartColors: any[] = [
    {
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)']
    }
  ];
  chartOptions: any = {
    responsive: true
  };
  constructor(
    private postService: PostService,
    private categoriesService: CategoriesService,
    private CustomersService: CustomerService,
    private commentService: CommentService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    await this.fetchCustomerStats();
    await this.fetchDataForChart();
  }
  ngOnDestroy(): void {
    if (this.customerStatsSubscription) {
      this.customerStatsSubscription.unsubscribe();
    }
  
  }

  fetchCustomerStats(): void {
this.customerStatsSubscription =  this.CustomersService.dataChart().subscribe(
      data => {
        data.forEach((item: any) => {
          if (item.month <= 12) {
            this.lineChartData[0].data[item.month - 1] = item.customer_count;
          }
        });
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching customer stats:', error);
      }
    );

  this.customerStatsSubscription =    this.postService.Chart().subscribe(
      data => {
        data.forEach((item: any) => {
          if (item.month <= 12) {
            this.lineChartData[1].data[item.month - 1] = item.post_count;
          }
        });
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching post stats:', error);
      }
    );
  }
  fetchDataForChart(): void {
    this.postService.dataChart().subscribe(
      response => {
        this.chartData = response.data.map((item: any) => item.so_luong);
        this.chartLabels = response.data.map((item: any) => item.name);
      },
      
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
