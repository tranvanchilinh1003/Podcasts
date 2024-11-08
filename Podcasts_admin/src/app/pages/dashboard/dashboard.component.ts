import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'app/@core/services/apis/post.service';
import { CustomerService } from 'app/@core/services/apis/customers.service';
import { DashboardDataService } from 'app/@core/services/apis/dashboard.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  
  startDate: string = '';  
  endDate: string = '';    
  minDate: Date;           
  
  selectedPeriod: string = 'Ngày';


  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Số lượng khách hàng' },
    { data: [], label: 'Số lượng bài đăng' }
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

  public topPostsChartData: ChartDataSets[] = [
    { data: [], label: 'Lượt xem bài đăng' }
  ];
  public topPostsChartLabels: Label[] = [];
  public topPostsChartType: ChartType = 'bar';
  public topPostsChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          const index = tooltipItem.index;
          const post = this.topPosts[index];
          return `${post.title} - ${post.username}: ${post.total_views} views`;
        },
      },
    },
  };

  private topPosts: any[] = []; 
  private customerStatsSubscription: Subscription;
  private postStatsSubscription: Subscription;

  constructor(
    private postService: PostService,
    private CustomersService: CustomerService,
    private dashboardService: DashboardDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const today = new Date();
    this.minDate = today;  

  
    this.startDate = this.formatDate(today);
    this.endDate = this.formatDate(today);
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    if (this.customerStatsSubscription) {
      this.customerStatsSubscription.unsubscribe();
    }
    if (this.postStatsSubscription) {
      this.postStatsSubscription.unsubscribe();
    }
  }

  
  loadDashboardData(): void {
    const savedCustomerData = this.dashboardService.getCustomerData();
    const savedPostData = this.dashboardService.getPostData();

    if (savedCustomerData) {
      this.lineChartData[0].data = savedCustomerData;
    } else {
      this.fetchCustomerStats();
    }

    if (savedPostData) {
      this.lineChartData[1].data = savedPostData;
    } else {
      this.fetchPostStats();
    }
  }


  fetchCustomerStats(): void {
    this.customerStatsSubscription = this.CustomersService.dataChart().subscribe(
      data => {
        const customerData = new Array(12).fill(0);
        data.forEach((item: any) => {
          if (item.month <= 12) {
            customerData[item.month - 1] = item.customer_count;
          }
        });
        this.dashboardService.setCustomerData(customerData);
        this.lineChartData[0].data = customerData;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching customer stats:', error);
      }
    );
  }


  fetchPostStats(): void {
    this.postStatsSubscription = this.postService.Chart().subscribe(
      data => {
        const postData = new Array(12).fill(0);
        data.forEach((item: any) => {
          if (item.month <= 12) {
            postData[item.month - 1] = item.post_count;
          }
        });
        this.dashboardService.setPostData(postData);
        this.lineChartData[1].data = postData;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching post stats:', error);
      }
    );
  }

  public formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  
  onDateChange(): void {
    console.log("Chọn từ ngày:", this.startDate, "đến ngày:", this.endDate);
  }


  filterData(): void {
    if (!this.startDate || !this.endDate) {
      console.error("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ");
      return;
    }

    console.log("Lọc dữ liệu từ:", this.startDate, "đến:", this.endDate);
    this.fetchDataForChart(this.startDate, this.endDate);
  }

  fetchDataForChart(startDate: string, endDate: string): void {
    this.postService.dataChart(startDate, endDate).subscribe(
      response => {
        this.topPosts = response.data;
        this.topPostsChartLabels = response.data.map(post => `Ngày ${post.day}`);
        
        this.topPostsChartData = [
          {
            data: response.data.map(post => post.total_views),
            label: `Tổng số lượt xem từ ${startDate} đến ${endDate}`,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }
        ];
        
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
