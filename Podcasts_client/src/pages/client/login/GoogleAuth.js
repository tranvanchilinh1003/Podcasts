import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import axios from "axios";
import { login } from "../../../services/apis/login";
import { Link, useNavigate } from "react-router-dom";
import { useAuthClient } from "./AuthContext";
import { DialogService } from "../../../services/common/DialogService";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const CLIENT_ID = "973247984258-riadtumd7jcati9d9g9ip47tuqfqdkhc.apps.googleusercontent.com";
const API_KEY = "AIzaSyAp8wzduKw5P30-B0hUnGD1qiuuj73L8qs";
const API_BASE_URL = "http://localhost:8080"; 

function removeDiacriticsAndSpaces(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
}

function GoogleAuth({ onLogin }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { customer, login, logout, loginGoogle } = useAuthClient();
  const navigate = useNavigate();
  useEffect(() => {
    const initClient = () => {
      gapi.load("client:auth2", () => {
        gapi.client
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: "email",
          })
          .then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            setIsLoggedIn(authInstance.isSignedIn.get());
            authInstance.isSignedIn.listen(setIsLoggedIn);
          })
          .catch((error) => {
            console.error("Error initializing Google API client", error);
          });
      });
    };

    initClient();
  }, []);

  const handleLogin = async () => { 
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      const profile = user.getBasicProfile();
      const email = profile.getEmail();
     const username = removeDiacriticsAndSpaces(profile.getName().toLowerCase());
      const images = profile.getImageUrl();

      const role = "user";
      const create_date = new Date().toISOString();
      const password = "123456789";
      const imageRef = ref(storage, `upload/${username}`);
      const response = await fetch(images);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);

      
      const imageUrl = await getDownloadURL(imageRef);


      const checkResponse = await axios.post(
        `${API_BASE_URL}/api/check_email`,
        { email }
      );

      if (checkResponse.data.exists) {
        await axios.post(`${API_BASE_URL}/api/customers`, {
          username,
          email,
          images: username,
          role,
          create_date,
          password,
          isticket: 'inactive',
          gender: 0
        });
        const data = {
          username,
          password,
        };
        const loginResponse = await login(data);
        await DialogService.success("Đăng nhập thành công");
        navigate("/");
      }
      // if(!checkResponse.data.exists){
      //   const data = {
      //     username: checkResponse.data.data[0].username,
      //     password: checkResponse.data.data[0].password,
      //   };
      //   const loginResponse = await login(data);
      //   await DialogService.success('Đăng nhập thành công')
      //   navigate('/');
      // }

    else {
        if (onLogin) {
          await onLogin(checkResponse.data.data);
          await loginGoogle(checkResponse.data.data); 
          await localStorage.setItem(
            "customer",
            JSON.stringify(checkResponse.data.data)
          );
          await localStorage.setItem("userToken", checkResponse.data.token);
          await DialogService.success("Đăng nhập thành công");
          await navigate("/");
        }
      } 
    } catch (error) {
      console.error("Error during sign-in", error);
    }
  };

  const handleLogout = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error during sign-out", error);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
    ''
      ) : (
        <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512"  onClick={handleLogin}>
        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
      
      </svg>
    
      )}
    </div>
  );
}

export default GoogleAuth;
