import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { changePassword as change } from '../../../services/apis/login';
import './css.css';
import { DialogService } from '../../../services/common/DialogService';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch('password'); 

  const changePassword = async (formData) => {
    try {
      const email = localStorage.getItem('email');
      const value = {
        ...formData,
        email 
      };

      const response = await change(value);
      DialogService.success('Mật khẩu đã được thay đổi thành công');
      navigate('/login');
    } catch (error) {
      DialogService.error('Có lỗi xảy ra khi thay đổi mật khẩu');
      console.error('Change password failed:', error);
    }
  };

  const onSubmit = async (data) => {
    await changePassword(data);
  };

  return (
    <>
      <section className="about-section section-padding" id="section_2">
    <div className="container container_login mt-5">
      <Link to='/forgotPassword'>
        <i className="bi bi-arrow-left-short fs-3"></i>
      </Link>
      <div className="heading">Đổi mật khẩu</div>
      <p className="sub-title text-center text-danger fst-italic">
        Chú ý đặt mật khẩu không cho ai xem vấn đề bảo mật an toàn
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <input
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
              minLength: {
                value: 8,
                message: "Mật khẩu phải trên 8 kí tự"
              }
            })}
            className="input"
            type="password"
            placeholder="Mật khẩu"
            aria-label="password"
          />
          {errors.password && <span className="text-danger messages">{errors.password.message}</span>}
        </div>
        <div className="form-group">
          <input
            {...register("confirm_password", {
              required: "Vui lòng nhập xác nhận mật khẩu",
              validate: value =>
                value === password || "Mật khẩu xác nhận không khớp"
            })}
            className="input"
            type="password"
            placeholder="Xác nhận mật khẩu"
            aria-label="confirm_password"
          />
          {errors.confirm_password && <span className="text-danger messages">{errors.confirm_password.message}</span>}
        </div>
        <input
          className="login-button"
          type="submit"
          value="Xác nhận"
          aria-label="Xác nhận"
        />
      </form>
    </div>
    </section>
    </>
  );
};

export default ChangePassword;
