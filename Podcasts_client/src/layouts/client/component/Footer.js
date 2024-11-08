import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Footer({ userId, user, categories }) {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Kiểm tra nếu cuộn xuống gần 50% chiều cao trang
      if (scrollPosition > documentHeight / 2 - windowHeight) {
          setShowScrollButton(true);
      } else {
          setShowScrollButton(false);
      }
  };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showScrollButton && (
        <div className="container d-flex justify-content-end fixed-bottom mb-5 me-5"  style={{
          display: showScrollButton ? 'block' : 'none',
        
      }}> 
          <button className="button-roll " onClick={scrollToTop}>
            <svg className="svgIcon" viewBox="0 0 384 512">
              <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
            </svg>
          </button>
        </div>
      )}
      <footer className="site-footer text-center">
        <div className="container pt-5">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-12 d-flex justify-content-center mb-3 mb-md-0">
              <Link className="navbar-brand" to="/">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2Ficon.png?alt=media&token=a5846c3a-f685-4365-a3d7-9a1e8152f14e"
                  className="logo-image img-fluid"
                  alt="templatemo pod talk"
                />
              </Link>
            </div>
            <div className="col-lg-10 col-md-12 d-flex align-items-center justify-content-center">
              <p className="copyright-text text-center mb-0">
                Copyright © 2024 &#128525; &#128536; by CUISINE PODCASTS
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
