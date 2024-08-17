import React from "react";

export const API_BASE_URL = 'http://localhost:4200';

export const API_ENDPOINT = {
  auth: {
    base: `${API_BASE_URL}/api`,
    login: '/api/login',
    logout: '/api/logout',
    forgotPassword: '/api/forgotPassword',
    otp: '/api/otp',
    changePassword: '/api/changepassword',

  }
};

