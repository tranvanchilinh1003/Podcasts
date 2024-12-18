export class IPost {
  [x: string]: any;
  id: string;
  title: string;
  description: string;
  audio: string;
  images: string;
  categories_id: string;
  customers_id: string;
  create_date?: string; 
  username?: string;
  images_customers?:string;
  view?: string;
  total_comments?:string;
  total_likes?:  number;
  isticket?:string;
  action?: string | number;
}
  export class MonthlyView {
    id: string;
    month: number;
    total_views: number;
}

export class ApiResponse {
    monthlyViews: MonthlyView[];
    posts: IPost[];
}
