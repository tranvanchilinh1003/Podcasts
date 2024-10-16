import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Progress } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import axiosInstance from '../firebase/axiosConfig';
import { DialogService } from "../../../services/common/DialogService";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase';
import Spinner from '../Spinner/Spinner';

function InfoUser() {
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [oldImage, setOldImage] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [imgUploadProgress, setImgUploadProgress] = useState(0);

    const uploadFile = async (file, path, setProgress) => {
        const fileRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImgUploadProgress(progress);
        });

        await uploadTask;
        setImgUploadProgress(100); // Ensure progress is set to 100 after successful upload
        return path.split('/').pop();
    };
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/customers/${id}`);
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

    useEffect(() => {
   
        fetchUserInfo();
    }, [id, setValue]);
    const onSubmit = async (data) => {
        setIsUploading(true);
        if (file) {
            const fileExtension = file.name.split('.').pop();
            const currentDate = new Date();
            const newFileName = `${currentDate.toISOString().replace(/[:.]/g, '-')}.${fileExtension}`;
            const path = `upload/${newFileName}`;
            const storageRef = ref(storage, path);
            data.images = await uploadFile(file, path, setImgUploadProgress);

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
                fetchUserInfo();
            }
        } catch (error) {
            console.error('Update failed:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 400) {
                DialogService.error('Username or email already exists.');
            } else {
                DialogService.error('Update failed. Please try again.');
            }
        } finally {
            setIsUploading(false);
            setImgUploadProgress(0);
        }
    };
    
        

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="col-md-6 ">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Tên Người Dùng:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        disabled
                        {...register('username', { required: 'Tài Khoản là bắt buộc' })}
                    />
                    {errors.username && <span className="text-danger">{errors.username.message}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="full_name" className="form-label">Họ Tên:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="full_name"
                        {...register('full_name', { required: 'Họ tên là bắt buộc' })}
                    />
                    {errors.full_name && <span className="text-danger">{errors.full_name.message}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        disabled
                        {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Địa chỉ email không hợp lệ' } })}
                    />
                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="images" className="form-label">Hình Đại Diện:</label>
                    <input
                        type="file"
                        className="form-control"
                        id="images"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Progress percent={imgUploadProgress} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Giới Tính:</label><br />
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="male"
                            value="0"
                            {...register('gender')}
                            defaultChecked={userInfo && userInfo.gender === '0'}
                        />
                        <label className="form-check-label" htmlFor="male">Nam</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="female"
                            value="1"
                            {...register('gender')}
                            defaultChecked={userInfo && userInfo.gender === '1'}
                        />
                        <label className="form-check-label" htmlFor="female">Nữ</label>
                    </div>
                </div>


                <div className="text-end">
                    <button type="submit" className="btn btn-primary" disabled={isUploading}>Cập Nhật Hồ Sơ</button>
                </div>
            </form>
        </div>
    );
}

export default InfoUser;
