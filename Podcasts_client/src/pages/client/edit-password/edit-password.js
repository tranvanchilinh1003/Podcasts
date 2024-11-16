import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axiosInstance from '../firebase/axiosConfig';
import { useAuthClient } from '../../../pages/client/login/AuthContext';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DialogService } from "../../../services/common/DialogService";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { gapi } from 'gapi-script';
import { API_ENDPOINT } from "../../../config/api-endpoint.config";
const CLIENT_ID = "973247984258-riadtumd7jcati9d9g9ip47tuqfqdkhc.apps.googleusercontent.com";
const API_KEY = "AIzaSyAp8wzduKw5P30-B0hUnGD1qiuuj73L8qs";

function EditPassword() {

    const { id } = useParams();
    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm();
    const [oldPassword, setOldPassword] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [data, setData] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [oldImage, setOldImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logout } = useAuthClient();
    const navigate = useNavigate();
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



    const onSubmit = async (data) => {
        console.log(data);
        setIsUploading(true);
        if (file) {
            const fileExtension = file.name.split('.').pop();
            const currentDate = new Date();
            const newFileName = `${currentDate.toISOString().replace(/[:.]/g, '-')}.${fileExtension}`;
            const path = `upload/${newFileName}`;
            const storageRef = ref(storage, path);

            try {
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                data.images = newFileName; // Set the new image URL
            } catch (error) {
                console.error('Upload failed:', error);
                DialogService.error('Upload failed. Please try again.');
                setIsUploading(false);
                return;
            }
        } else {
            data.images = oldImage;
        }
        data.isticket = 'active';
        data.date = new Date().toISOString();
        data.password = data.password || oldPassword;
        console.log('Data to submit:', data);
        try {
            data.role = 'user';
            const response = await axiosInstance.patch(`/api/customers/${id}`, data);
            if (response.status === 200) {
                DialogService.success('Cập nhật tài khoản thành công');
                if (typeof gapi !== 'undefined' && gapi.auth2) {
                    const authInstance = gapi.auth2.getAuthInstance();
                    if (authInstance) {
                        await authInstance.signOut();
                    }
                }
                setTimeout(() => {
                    logout();
                    navigate('/login');
                }, 1500);
            }
        } catch (error) {
            console.error('Update failed:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 400) {
                DialogService.error('Username or email already exists.');
            } else {
                DialogService.error('Update failed. Please try again.');
            }
        }
    };
    useEffect(() => {
        // console.log("Fetching user info...");
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_ENDPOINT.auth.base}/customers/${id}`);
                // console.log("User info received:", response.data.data);
                const user = response.data.data[0];
                setUserInfo(user);
                setOldImage(user.images);
                setOldPassword(user.password);
                setValue('username', user.username);
                setValue('full_name', user.full_name);
                setValue('email', user.email);
                setValue('gender', user.gender.toString());
            } catch (err) {
                console.error('Failed to fetch user info:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [id, setValue]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Mật Khẩu:</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                />
                {errors.password && <span className="text-danger">{errors.password.message}</span>}
            </div>
            {/* <div className="mb-3">
                <label htmlFor="password" className="form-label">Mật Khẩu Mới:</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    {...register('password', { required: 'Vui lòng nhập mật khẩu mới' })}
                />
                {errors.password && <span className="text-danger">{errors.password.message}</span>}
            </div> */}
            <div className="mb-3">
                <label htmlFor="confirm_password" className="form-label">Xác Nhận Mật Khẩu:</label>
                <input
                    type="password"
                    className="form-control"
                    id="confirm_password"
                    {...register('confirm_password', { validate: value => value === watch('password') || 'Mật khẩu không khớp' })}
                />
                {errors.confirm_password && <span className="text-danger">{errors.confirm_password.message}</span>}
            </div>
            <div className="text-end">
                <button type="submit" className="btn btn-primary">Cập Nhật Mật Khẩu</button>
            </div>
        </form>
    );
}

export default EditPassword;
