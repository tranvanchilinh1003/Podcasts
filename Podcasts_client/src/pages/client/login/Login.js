import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthClient } from "./AuthContext";
import { DialogService } from "../../../services/common/DialogService";
import GoogleAuth from "./GoogleAuth";
import Facebook from "./Facebook";

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
      await DialogService.success('Đăng nhập thành công')
      navigate('/');
    } catch (error) {
      DialogService.error('Tài khoản hoặc mật khẩu không đúng');
    }
  };

  const handleGoogleLogin = (profile) => {

    console.log('Google login profile:', profile);

    navigate('/');
  };

  return (
    <>
      <header className="site-header d-flex flex-column justify-content-center align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="mb-2">Đăng nhập</h2>
            </div>
          </div>
        </div>
      </header>

      <section className="about-section section-padding" id="section_2">
        <div className="container">
          <div className="login-box m-auto" id="bg-login">
            <h2 className="mb-5">Đăng nhập</h2>
            <form
              className="form needs-validation"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
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
                <label htmlFor="username">Tài khoản</label>
              </div>
              <div className="user-box">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc.",
                    minLength: {
                      value: 8,
                      message: "Mật khẩu phải ít nhất 8 ký tự.",
                    },
                  })}
                />
                <p className="text-end " style={{fontSize: 12}}>        <Link to='' className="text-warning">Quên mật khẩu?</Link></p>
                <label htmlFor="password">Mật khẩu</label>
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
              <div className="text-right d-flex justify-content-sm-end">
        
                <button className="btn_submit w-100 bg-transparent" type="submit">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Đăng nhập
                </button>
              </div>
              <div className="text-center mt-5">
  
                <p className="text-white">
                  Bạn đã có tài khoản chưa?{" "}
                  <Link className="text-sm-start" to="/register">
                    Đăng ký
                  </Link>
                </p>
              </div>
              </form>
              <ul className="wrapper list-unstyled d-flex justify-content-center mt-4">
                <li className="icon facebook me-3">
                  {/* <span className="tooltip">Facebook</span>
                  <svg
                    viewBox="0 0 320 512"
                    height="1.5em"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                  </svg> */}
                  <Facebook />
                </li>
                <li className="icon instagram">
                  <span className="tooltip">Google</span>
                  <GoogleAuth onLogin={handleGoogleLogin} />
                </li>
              </ul>
          
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
