import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import axios from "axios";
import { login } from "../../../services/apis/login";
import { Link, useNavigate } from "react-router-dom";
import { useAuthClient } from "./AuthContext";
import { DialogService } from "../../../services/common/DialogService";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const CLIENT_ID =
  "973247984258-riadtumd7jcati9d9g9ip47tuqfqdkhc.apps.googleusercontent.com";
const API_KEY = "AIzaSyAp8wzduKw5P30-B0hUnGD1qiuuj73L8qs";
const API_BASE_URL = "http://localhost:8080"; // Thay thế bằng URL của bạn

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
      const username = profile.getName().toLowerCase();
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
          isticket: 'inactive'
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

      if (!checkResponse.data.exists) {
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
      } else {
        console.error("Login failed:", loginResponse.data.message);
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
        <i className="bi bi-google" onClick={handleLogin}></i>
      )}
    </div>
  );
}

export default GoogleAuth;
