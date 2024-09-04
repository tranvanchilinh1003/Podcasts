import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as authLogin } from '../../../services/apis/login'; 
const AuthContextClient = createContext();

export const AuthProviderClient = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    const storedToken = localStorage.getItem('userToken');

    if (storedCustomer && storedToken) {
      setCustomer(JSON.parse(storedCustomer));
      setIsLoggedIn(true);
    }
    
  }, []);

  const login = async (customerData) => {
    try {
      const response = await authLogin(customerData);
      console.log('Login response:', response); // Debugging
      const { token, userInfo } = response;
      localStorage.setItem('customer', JSON.stringify(response.data));
      localStorage.setItem('userToken', token);
      setCustomer(response.data);
      setIsLoggedIn(true);
      return response;
    } catch (error) {
      console.error('Login error:', error); // Debugging
      throw error;
    }
  };
  
  const loginGoogle = (user) => {
    setIsLoggedIn(true);
    setCustomer(user)
  
  }
  const logout = () => {
    localStorage.removeItem('customer');
    localStorage.removeItem('userToken');
    setCustomer(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContextClient.Provider value={{ isLoggedIn, customer, login, logout, loginGoogle }}>
      {children}
    </AuthContextClient.Provider>
  );
};

export const useAuthClient = () => useContext(AuthContextClient);
