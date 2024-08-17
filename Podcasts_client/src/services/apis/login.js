import axios from 'axios';

import { API_BASE_URL, API_ENDPOINT } from '../../config/api-endpoint.config'; 
import { LOCALSTORAGE_KEY } from '../../config/localStorageKey.config';
import { jwtDecode } from 'jwt-decode';

// Local Storage Functions
const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

const clear = () => {
  localStorage.clear();
};

// AuthService Functions
export const login = async (form) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINT.auth.login}`, {
      username: form.username.trim(),
      role: form.role,
      password: form.password,
    });
    return response.data;
  } catch (error) {

  }
};

export const requirePassword = async (form) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINT.auth.requirePassword}`, {
      id: getId(),
      password: form.password,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Yêu cầu mật khẩu thất bại:', error);
    throw error;
  }
};

export const changePassword = async (form) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}${API_ENDPOINT.auth.changePassword}`, {
      password: form.password,
      email: form.email,
    });
    return response.data;
  } catch (error) {
    console.error('Thay đổi mật khẩu thất bại:', error);
    throw error;
  }
};

export const forgotPassword = async (form) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINT.auth.forgotPassword}`, {
      email: form.email 
    });
    return response.data;
  } catch (error) {
    console.error("Failed to send reset email:", error);
    throw error; // Ensure errors are propagated for handling in the component
  }
};

export const checkOTP = async (form) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINT.auth.otp}`, {
      email: form.email,
      otp: form.otp
    });
    return response.data;
  } catch (error) {
    console.error('Kiểm tra OTP thất bại:', error);
    throw error;
  }
};

export const updateProfile = async (form) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}${API_ENDPOINT.auth.updateProfile}`, {
      firstName: form.firstName,
      lastName: form.lastName,
      token: getToken(),
    });
    return response.data;
  } catch (error) {
    console.error('Cập nhật hồ sơ thất bại:', error);
    throw error;
  }
};

export const getId = () => {
  const loginInfo = getLoginInfo();
  return loginInfo ? loginInfo.id : null;
};

export const cacheLoginInfo = (value) => {
  setItem(LOCALSTORAGE_KEY.userInfo, value);
};

export const cacheUpdateMessage = (alertMessages) => {
  setItem(LOCALSTORAGE_KEY.alertMessages, alertMessages);
};

export const clearMessage = () => {
  removeItem(LOCALSTORAGE_KEY.alertMessages);
};

export const getUpdateMessage = () => {
  return getItem(LOCALSTORAGE_KEY.alertMessages);
};

export const logout = async () => {
  const token = getToken();
  try {
    await axios.post(`${API_BASE_URL}${API_ENDPOINT.auth.logout}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    removeItem(LOCALSTORAGE_KEY.token);
    removeItem(LOCALSTORAGE_KEY.userInfo);
    window.location.href = '/auth/login'; // Thay đổi đường dẫn nếu cần
  } catch (error) {
    console.error('Đăng xuất thất bại:', error);
    removeItem(LOCALSTORAGE_KEY.token);
    removeItem(LOCALSTORAGE_KEY.userInfo);
    window.location.href = '/auth/login'; // Thay đổi đường dẫn nếu cần
  }
};

export const isLoggedIn = () => {
  const token = getToken();
  if (token) {
    const decodedToken = jwtDecode(token);
    const expired = decodedToken.exp < Date.now() / 1000;
    if (expired) {
      clear();
      return false;
    }
    return !expired;
  }
  return false;
};

export const getToken = () => {
  return getItem(LOCALSTORAGE_KEY.token);
};

export const getLoginInfo = () => {
  return getItem(LOCALSTORAGE_KEY.userInfo);
};
