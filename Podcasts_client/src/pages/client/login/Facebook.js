import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { useAuthClient } from './AuthContext'; 
import { DialogService } from '../../../services/common/DialogService';
import { Link, useNavigate } from "react-router-dom";

const FACEBOOK_APP_ID = '462471983358382'; 

function FacebookAuth() {
  const { loginGoogle } = useAuthClient(); 
  const navigate = useNavigate();

  const responseFacebook = async (response) => {
    console.log("Facebook Response:", response); // Thêm console.log để kiểm tra phản hồi

    if (response.accessToken) {
      const { name, email, picture } = response;
      const user = [{
        username: name.toLowerCase(),
        email,
        images: picture.data.url
      }]
      
    
        await loginGoogle(user); 
        await localStorage.setItem(
          "customer",
          JSON.stringify(user)
        );
        await localStorage.setItem("userToken", response.accessToken);
        await DialogService.success("Đăng nhập thành công");
        navigate("/");
    
    } else {
      console.error('Login failed:', response);
      await DialogService.error("Đăng nhập thất bại");
    }
  };

  return (
    <FacebookLogin
      appId={FACEBOOK_APP_ID}
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
      icon="fa-facebook"
      textButton="" 
      cssClass="facebook border-0"
      scope="public_profile,email"
    />
  );
}

export default FacebookAuth;
