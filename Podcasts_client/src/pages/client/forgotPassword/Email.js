import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { forgotPassword as forGot } from '../../../services/apis/login';
import './css.css';
import { DialogService } from '../../../services/common/DialogService';

const Email = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const checkMail = async (form) => {
    try {
      const response = await forGot(form);
      localStorage.setItem('email', response.data);
      DialogService.success('Vui lòng check mail để nhập OTP')
    } catch (error) {
      DialogService.error('Email không tồn tại');
      throw error; // Rethrow to handle it in the onSubmit
    }
  };

  const onSubmit = async (data) => {
    try {
      await checkMail(data);
      navigate('/otp');
    } catch (err) {
      // Optionally handle any additional error logic here
    }
  };

  return (
    <>
    <section className="about-section section-padding" id="section_2">
    <div className="container container_login mt-5">
      <Link to='/login'>
        <i className="bi bi-arrow-left-short fs-3"></i>
      </Link>
      <div className="heading">Quên mật khẩu</div>
      <p className="sub-title text-center text-danger fst-italic">
        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu của bạn
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <input
            {...register("email", {
              required: "Vui lòng nhập email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email không hợp lệ"
              }
            })}
            className="input"
            type="email"
            placeholder="Email"
            aria-label="email"
          />
          {errors.email && <span className="text-danger messages">{errors.email.message}</span>}
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

export default Email;
