import React from 'react';
import { Link } from "react-router-dom";
import axiosInstance from '../firebase/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { DialogService } from "../../../services/common/DialogService";
import { useForm } from 'react-hook-form';
// import axios from 'axios';

function Register() {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      // Make API request to register user
      data.role = 'user';
      data.images = 'anh_dai_dien.jpg';
      data.isticket = 'inactive';
      data.gender = 0;
      const response = await axiosInstance.post('/api/customers', data);
      console.log(response.data.data);
      navigate(`/login`);
      await DialogService.success('Đăng ký thành công')
    } catch (error) {
      if (error.response && error.response.status === 400) {
        DialogService.error('Tài khoản hoặc email đã tồn tại');
      }
    }
  };

  return (
    <>
  

      <section className="about-section section-padding" id="section_2">
        <div className="container">
          <div className="login-box m-auto" id="bg-login">
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="form needs-validation" noValidate>
              <div className="user-box">
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  {...register("username", {
                    required: "Tài khoản là bắt buộc.",
                    pattern: {
                      value: /^[a-z0-9_]*$/,
                      message: "Tài khoản không được chứa ký tự đặc biệt hoặc chữ in hoa.",
                    },
                    minLength: {
                      value: 6,
                      message: "Tài khoản phải ít nhất 6 ký tự.",
                    },
                  })}
                />
                {errors.username && (
                  <span
                    id="usernameFeedback"
                    className="text-danger messageerr mb-2"
                    style={{ fontSize: "13px" }}
                  >
                    {errors.username.message}
                  </span>
                )}
                <label>Tài khoản</label>
              </div>
              <div className="user-box">
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  required
                  {...register("full_name", {
                    required: "Họ tên là bắt buộc.",
                  })}
                />
                {errors.full_name && <span className="text-danger messageerr" style={{ fontSize: '13px' }}>{errors.full_name.message}</span>}
                <label>Họ tên</label>
              </div>
              <div className="user-box">
                <input
                  type="text"
                  name="email"
                  id="email"
                  required
                  {...register("email", { required: 'Email là bắt buộc', pattern: { value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, message: 'Vui lòng nhập đúng email' } })}
                />
                {errors.email && <span className="text-danger messageerr" style={{ fontSize: '13px' }}>{errors.email.message}</span>}
                <label>Email</label>
              </div>
              <div className="user-box">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  {...register("password", { required: 'Mật khẩu là bắt buộc', minLength: { value: 6, message: 'Mật khẩu ít nhất 6 ký tự' } })}
                />
                {errors.password && <span className="text-danger messageerr" style={{ fontSize: '13px' }}>{errors.password.message}</span>}
                <label>Mật khẩu</label>
              </div>
              <div className="user-box">
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  required
                  {...register("confirm_password", {
                    required: 'Xác nhận mật khẩu là bắt buộc',
                    validate: value => value === getValues('password') || 'Mật khẩu không khớp'
                  })}
                />
                {errors.confirm_password && <span className="text-danger messageerr" style={{ fontSize: '13px' }}>{errors.confirm_password.message}</span>}
                <label>Xác nhận mật khẩu</label>
              </div>
              <div className="text-right d-flex justify-content-sm-end">
                <button className="btn-signup bg-transparent" type="submit">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Đăng ký
                </button>
              </div>
              <div className="text-center mt-5">
                <p className="text-white">
                  Đăng nhập ngay! <Link className="text-info" to="/login">Đăng nhập</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;
