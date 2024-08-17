// axiosConfig.js
import axios from 'axios';
import { environment } from './environment'; // Import environment configuration

const axiosInstance = axios.create({
  baseURL: environment.apiBaseUrl,
});

export default axiosInstance;
