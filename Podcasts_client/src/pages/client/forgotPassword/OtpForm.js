import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import './css.css'; // Ensure you have proper CSS for the form
import { checkOTP as check } from '../../../services/apis/login';
import { DialogService } from '../../../services/common/DialogService';

const OTPForm = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors, isValid }, getValues, setValue } = useForm({
    mode: 'onChange',
  });

  const getOTPValue = () => {
    const otpValues = [];
    for (let i = 0; i < 5; i++) {
      otpValues.push(getValues(`otp[${i}]`));
    }
    return otpValues.join('');
  };

  const checkOTP = async (form) => {
    const email = localStorage.getItem('email');
    const otp = getOTPValue();
  
    const value = {
      email,
      otp,
    };

    try {
      const response = await check(value);
      if (response.success) {
        DialogService.success(response.message);
        return true; 
      } else {
        DialogService.error(response.message);
        return false; 
      }
    } catch (error) {
      DialogService.error('OTP không đúng');
      throw error;
    }
  };

  const onSubmit = async (data) => {
    try {
      const isValidOTP = await checkOTP(data);
      if (isValidOTP) {
        navigate('/changepassword'); 
      }
    } catch (error) {
      console.error("Submission failed: ", error);
    }
  };

  
  const handlePaste = (e, index) => {
    const pasteData = e.clipboardData.getData('Text');
    const otpValues = pasteData.slice(0, 5).split('');
    
    otpValues.forEach((value, idx) => {
      setValue(`otp[${idx}]`, otpValues[idx] || ''); 
    });
  };

  return (
    <>
      <section className="about-section section-padding" id="section_2">
        <form onSubmit={handleSubmit(onSubmit)} className="container container_login mt-5">
          <Link to='/forgotPassword'>
            <i className="bi bi-arrow-left-short fs-3"></i>
          </Link>
          <h1 id="title" className="title text-center">Nhập OTP</h1>
          <p className="sub-title text-center text-danger fst-italic">Vui lòng check email nhập OTP</p>
          <div className="form-control-group mb-3">
            <label className="label" htmlFor="otp">Nhập OTP:</label>
            <div className="inputs responsive">
              {Array.from({ length: 5 }).map((_, index) => (
                <Controller
                  key={index}
                  name={`otp[${index}]`}
                  control={control}
                  defaultValue=""
                  rules={{ required: "Vui lòng nhập OTP" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="bg-transparent otp-input"
                      type="text"
                      maxLength="1"
                      tabIndex={index + 1}
                      autoFocus={index === 0}
                      onPaste={(e) => handlePaste(e, index)} 
                    />
                  )}
                />
              ))}
            </div>
            {Object.keys(errors).length > 0 && (
              <small className="text-danger">Vui lòng nhập đầy đủ OTP.</small>
            )}
          </div>
          <button type="submit" style={{background: 'linear-gradient( #FF8C00, #FFD700 )'}} className="mb-3 w-100 btn btn-primary" disabled={!isValid}>
            Gửi OTP
          </button>
        </form>
      </section>
    </>
  );
};

export default OTPForm;
