import React from "react";

function Contact() {
  return (
    <>
          <header className="site-header d-flex flex-column justify-content-center align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="mb-2">Liên hệ</h2>
            </div>
          </div>
        </div>
      </header>

    <div class="container mt-5">
                <div class="row justify-content-center">

                    <div class="col-lg-5 col-12 pe-lg-5">
                        <div class="contact-info">
                            <h3 class="mb-4">Liên hệ.</h3>

                            <p class="d-flex border-bottom pb-3 mb-4">
                                <strong class="d-inline me-4">Hotline:</strong>
                                <span>+84901443582</span>
                            </p>

                            <p class="d-flex border-bottom pb-3 mb-4">
                                <strong class="d-inline me-4">Email:</strong>
                                <a href="#">podcast@gmail.com</a>
                            </p>

                            <p class="d-flex">
                                <strong class="d-inline me-4">Địa chỉ:</strong>
                                <span>Toà nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ, Việt Nam</span>
                            </p>
                        </div>
                    </div>

                    <div class="col-lg-5 col-12 mt-5 mt-lg-0">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.420494742025!2d105.75565247484556!3d9.982081490122408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08906415c355f%3A0x416815a99ebd841e!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1715695236855!5m2!1svi!2s" width="600" height="450" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>

                    <div class="col-lg-8 col-12 mx-auto">
                    <div class="section-title-wrap mb-5">
                        <h4 class="section-title">Liên hệ với chúng tôi</h4>
                    </div>

                    <form action="" method="post" class="custom-form contact-form" role="form">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-12">
                                <div class="form-floating">
                                    <input type="text" name="full_name" id="full_name" class="form-control"
                                        placeholder="Full Name" required=""></input>

                                    <label for="floatingInput">Họ và tên</label>
                                </div>
                            </div>

                            <div class="col-lg-6 col-md-6 col-12">
                                <div class="form-floating">
                                    <input type="email" name="email" id="email" pattern="[^ @]*@[^ @]*"
                                        class="form-control" placeholder="Email address" required=""></input>
<label for="floatingInput">Địa chỉ email</label>
                                </div>
                            </div>

                            <div class="col-lg-12 col-12">
                               

                                <div class="form-floating">
                                    <textarea class="form-control" id="message" name="message"
                                        placeholder="Describe message here"></textarea>

                                    <label for="floatingTextarea">Liên lạc</label>
                                </div>
                            </div>

                            <div class="col-lg-4 col-12 ms-auto">
                                <button type="submit" class="form-control">Gửi</button>
                            </div>

                        </div>
                    </form>
                </div>
                </div>
            </div>
            </>
  );
}

export default Contact;
