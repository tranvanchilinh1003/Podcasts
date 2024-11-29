import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthClient } from "./AuthContext";
import { DialogService } from "../../../services/common/DialogService";
import GoogleAuth from "./GoogleAuth";


function Login() {
  const navigate = useNavigate();
  const { login } = useAuthClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      await DialogService.success("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      DialogService.error("Tài khoản hoặc mật khẩu không đúng");
    }
  };

  const handleGoogleLogin = (profile) => {
    // console.log("Google login profile:", profile);

    navigate("/");
  };

  return (
    <>
      <section className="about-section section-padding" id="section_2">
        <div className="container container_login mt-5">
          <div className="heading">Đăng nhập</div>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form-group">
              <input
                type="text"
                tabIndex={1}
                name="username"
                id="username"
                className="input"
                placeholder="Tài khoản.."
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
                type="password"
                tabIndex={2}
                name="password"
                id="password"
                className="input"
                placeholder="Mật khẩu..."
                {...register("password", {
                  required: "Mật khẩu là bắt buộc.",
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải ít nhất 8 ký tự.",
                  },
                })}
              />

              {errors.password && (
                <span
                  id="passwordFeedback"
                  className="text-danger messageerr mb-2"
                  style={{ fontSize: "13px" }}
                >
                  {errors.password.message}
                </span>
              )}
            </div>
            <p className="text-end " style={{ fontSize: 12 }}>
              {" "}
              <Link to="/forgotPassword" className="forgot-password fw-bold" style={{color: '#FF8C00'}}>
                Quên mật khẩu?
              </Link>
            </p>
            <input
              className="login-button"
              tabIndex={3}
              type="submit"
              value="Xác nhận"
              aria-label="Xác nhận"
            />
          </form>
          <div className="social-account-container">
            <span className="title" >Hoặc đăng nhập bằng</span>
            <div className="social-accounts">
              <button className="social-button google ">
                <GoogleAuth onLogin={handleGoogleLogin} />
              </button>
            </div>
          </div>
          <span className="agreement">
            <Link to="/register" className="forgot-password fw-bold" style={{color: '#FF8C00'}}>Đăng ký tài khoản tại đây!</Link>
          </span>
        </div>
      </section>
    </>
  );
}

export default Login;
