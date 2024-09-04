import React from 'react';
import { Routes, Route, useLocation  } from 'react-router-dom';
import Header from '../../layouts/client/component/Header';
import Home from '../../pages/client/home/Home';
import About from '../../pages/client/about/About';
import Contact from '../../pages/client/contact/Contact';
import Footer from '../../layouts/client/component/Footer';
import Login from '../../pages/client/login/Login';
import Register from '../../pages/client/register/Register';
import Categories from '../../pages/client/categories/Categories';
import CategoriesDetail from '../../pages/client/post/PostDetail';
import Account from '../../pages/client/account/account';
import SearchResults from '../../pages/client/search/SearchResult';


import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../assets/client/styles/css/bootstrap.min.css'
import '../../assets/client/styles/css/bootstrap-icons.css'
import '../../assets/client/styles/css/owl.theme.default.min.css'
import '../../assets/client/styles/css/owl.carousel.min.css'

import '../../assets/client/styles/css/main.css'
import '../../assets/client/styles/css/login.css'
import '../../assets/client/styles/css/templatemo-pod-talk.css'

import '../../assets/client/styles/vendor/fontawesome-free/css/all.min.css';
import '../../assets/client/styles/vendor/bootstrap/css/bootstrap.min.css';
import ScrollToTop from '../../layouts/client/component/ScrollToTop';
import Email from '../../pages/client/forgotPassword/Email'
import OTPForm from '../../pages/client/forgotPassword/OtpForm';
import ChangePassword from '../../pages/client/forgotPassword/ChangePassword';
import Follow from '../../pages/client/follow/follow';


const AppRouter = () => {
  const location = useLocation();
  return (
    <>
  <main>
      <Header />

    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/account/:id" element={<Account />}/>
        <Route path="/contact" element={<Contact />} />
        <Route path="/categories/:id" element={<Categories />} />
       <Route path="/getId_post/:id" element={<CategoriesDetail />} />
       <Route path="/post_search" element={<SearchResults />} /> 
       <Route path="/forgotPassword" element={<Email/>} />
      <Route path='/otp' element={<OTPForm />}/>
      <Route path='/changepassword' element={<ChangePassword />}/>
      <Route path="/follow/:id" element={<Follow />}/>
      </Routes>
  
      </main>
      <Footer/>
    </>
  );
}

export default AppRouter;
