import {APP_CONFIG} from "./app.config";
import {IAPIEndpoint} from "../interfaces";

export const API_BASE_URL = APP_CONFIG.apiBaseUrl;

export const API_ENDPOINT: IAPIEndpoint = {
  auth: {
    base: API_BASE_URL + '/' + 'api',
    login: '/api/login',
    logout: '/api/logout',
    forgotPassword: '/api/forgotPassword',
    otp: '/api/otp',
    changePassword: '/api/changepassword'
  },
  post: {
    base: API_BASE_URL + '/' + 'api',
    post: '/api/post',
    search: '/api/post_search',
    suggest_keywords: '/api/suggest_keywords',
    data: '/api/data',
    chart: '/api/data_post'
  },
  comment: {
    base: API_BASE_URL + '/' + 'api',
    comment: '/api/comment',
  },
  customers: {
    base: API_BASE_URL + '/' + 'api',
    customers: '/api/customers',
    search: '/api/customer_search',
    suggest_keywords: '/api/customer_keywords',
    data: '/api/data_customers'
  },
  categories: {
    base: API_BASE_URL + '/' + 'api',
    categories: '/api/categories',
  },
  shares: {
    base: API_BASE_URL + '/' + 'api',
    shares: '/api/shares' 
  },

  favourite: {
    base: API_BASE_URL + '/' + 'api',
    favourite: '/api/favourite' 
  },
};
