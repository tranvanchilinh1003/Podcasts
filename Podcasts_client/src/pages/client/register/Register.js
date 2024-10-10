import React from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../firebase/axiosConfig";
import { useNavigate } from "react-router-dom";
import { DialogService } from "../../../services/common/DialogService";
import { useForm } from "react-hook-form";
// import axios from 'axios';

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      // Make API request to register user
      data.role = "user";
      data.images = "anh_dai_dien.jpg";
      data.isticket = "inactive";
      data.gender = 0;
      const response = await axiosInstance.post("/api/customers", data);
      console.log(response.data.data);
      navigate(`/login`);
      await DialogService.success("Đăng ký thành công");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        DialogService.error("Tài khoản hoặc email đã tồn tại");
      }
    }
  };

  return (
    <>
      <section className="about-section section-padding" id="section_2">
    
        <div className="container container_login mt-5">
          <div className="heading">Đăng ký</div>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                id="username"
                className="input"
                placeholder="Tài khoản..."
                {...register("username", {
                  required: "Tài khoản là bắt buộc.",
                  pattern: {
                    value: /^[a-z0-9_]*$/,
                    message:
                      "Tài khoản không được chứa ký tự đặc biệt hoặc chữ in hoa.",
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
            </div>
            <div className="form-group">
              <input
                type="text"
                name="full_name"
                id="full_name"
                className="input"
                placeholder="Họ và Tên..."
                {...register("full_name", {
                  required: "Họ tên là bắt buộc.",
                })}
              />
              {errors.full_name && (
                <span
                  className="text-danger messageerr"
                  style={{ fontSize: "13px" }}
                >
                  {errors.full_name.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="email"
                id="email"
                className="input"
                placeholder="Gmail..."
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
                    message: "Vui lòng nhập đúng email",
                  },
                })}
              />
              {errors.email && (
                <span
                  className="text-danger messageerr"
                  style={{ fontSize: "13px" }}
                >
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                id="password"
                className="input"
                placeholder="Mật khẩu.."
                {...register("password", {
                  required: "Mật khẩu là bắt buộc",
                  minLength: { value: 8, message: "Mật khẩu ít nhất 8 ký tự" },
                })}
              />
              {errors.password && (
                <span
                  className="text-danger messageerr"
                  style={{ fontSize: "13px" }}
                >
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                className="input"
                placeholder="Xác nhận mật khẩu.."
                {...register("confirm_password", {
                  required: "Xác nhận mật khẩu là bắt buộc",
                  validate: (value) =>
                    value === getValues("password") || "Mật khẩu không khớp",
                })}
              />
              {errors.confirm_password && (
                <span
                  className="text-danger messageerr"
                  style={{ fontSize: "13px" }}
                >
                  {errors.confirm_password.message}
                </span>
              )}
            </div>

            <input
              className="login-button"
              type="submit"
              value="Đăng ký"
              aria-label="Xác nhận"
            />
          </form>
          <span className="agreement">
            <Link to="/login">Đăng Nhập tài khoản!</Link>
          </span>
        </div>
      </section>
    </>
  );
}

export default Register;
