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
  categories: {
    base: API_BASE_URL + '/' + 'api',
    categories: '/api/categories',
  },
  customers: {
    base: API_BASE_URL + '/' + 'api',
    customers: '/api/customers',
  },
};
