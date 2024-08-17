import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthClient } from '../../../pages/client/login/AuthContext';
import { DialogService } from '../../../services/common/DialogService';
import { gapi } from 'gapi-script';
import Spinner from '../../../pages/client/Spinner/Spinner';
import Search from '../../../pages/client/search/Search';
const CLIENT_ID = "973247984258-riadtumd7jcati9d9g9ip47tuqfqdkhc.apps.googleusercontent.com";
const API_KEY = "AIzaSyAp8wzduKw5P30-B0hUnGD1qiuuj73L8qs";

function Header() {
  const [categories, setCategories] = useState([]);
  const { isLoggedIn, customer, logout, loginGoogle } = useAuthClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/categories");
        setCategories(response.data.data); 
        
      } catch (error) {
        console.error('Error fetching categories:', error);
      }   finally {
        setLoading(false); 
      }
    };

    fetchCategories();
  }, [isLoggedIn]);

  useEffect(() => {
    const initializeGapi = () => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: 'email'
        }).then(() => {
          console.log('gapi initialized');
        }).catch((error) => {
          console.error('Error initializing gapi:', error);
        });
      });
    };

    initializeGapi();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const user = JSON.parse(localStorage.getItem('customer'));

    if (token && user) {
    
    } else {
      logout(); 
    }
  }, [logout], [loginGoogle]);

  const handleLogout = async () => {
    try {
      // Ensure gapi is loaded and auth instance is available
      if (typeof gapi !== 'undefined' && gapi.auth2) {
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance) {
          await authInstance.signOut();
        }
      }

      DialogService.success('Đăng xuất thành công');
      setTimeout(() => {
        logout(); 
        navigate('/login'); // Redirect to login page after logout
      }, 1500); // Wait 1.5 seconds before navigating

    } catch (error) {
      console.error('Error during sign-out', error);
    }
  };
  if (loading) {
    return <Spinner/>

  }
  return (
    <nav className="navbar navbar-expand-lg" style={{position: 'fixed'}}>
      <div className="container">
        <Link className="navbar-brand me-lg-5 me-0" to="/">
          <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2Ficon.png?alt=media&token=a5846c3a-f685-4365-a3d7-9a1e8152f14e" className="logo-image img-fluid" alt="templatemo pod talk" />
        </Link>

        <div className="custom-search">
         <Search/>
          <div className="dropdown list-inline bg-gradient rounded-3" id="searchSuggestions">
            <ul id="suggestionList" className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {/* Your dropdown content here */}
            </ul>
          </div>
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse d-flex align-items-center" id="navbarNav">
          <ul className="navbar-nav ms-lg-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">Về chúng tôi</Link>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="/client/menu/product" id="navbarLightDropdownMenuLink"
                role="button" data-bs-toggle="dropdown" aria-expanded="false">Thể loại</Link>
              <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="navbarLightDropdownMenuLink">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link className="dropdown-item" to={`/categories/${category.id}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Liên hệ</Link>
            </li>

            <div className="nav-item dropdown">
              {isLoggedIn ? (
                <>
                  <Link className="nav-link dropdown-toggle" to="#"
                    id="navbarLightDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {customer && customer.length > 0 && (
                      <img
                        className="img-profile rounded-circle"
                        src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${customer[0].images}?alt=media`}
                        width={40} height={40}
                        alt="profile"
                      />
                    )}
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="navbarLightDropdownMenuLink">
                    <li><Link className="dropdown-item" to={`/account/${customer[0].id}`}>{customer[0]?.username}</Link></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button></li>
                  </ul>
                </>
              ) : (
                <>
                  <Link className="nav-link dropdown-toggle" to="#"
                    id="navbarLightDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fs-4 bi bi-person-circle"></i>
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="navbarLightDropdownMenuLink">
                    <li><Link className="dropdown-item" to="/login">Đăng nhập</Link></li>
                    <li><Link className="dropdown-item" to="/register">Đăng ký</Link></li>
                  </ul>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;