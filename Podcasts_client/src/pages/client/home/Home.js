import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import './home.css';
import Post from '../post/Post';
import CategoriesHome from "../categories/CategoriesHome";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../../../config/api-endpoint.config";
function Home() {
  const [data, setData] = useState([]);
  const carouselRef = useRef(null);

  const fetchTopFollow = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT.auth.base}/follow`);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching follow data:', error);
    }
  };

  useEffect(() => {
    fetchTopFollow();
  }, []);

  useEffect(() => {
    // $(carouselRef.current).owlCarousel({
    //   loop: true,
    //   margin: 10,
    //   autoplay: true,
    //   autoplayTimeout: 2000,
    //   responsive: {
    //     0: { items: 1 },
    //     600: { items: 2 },
    //     1000: { items: 3 },
    //   },
    // });
    $('.owl-carousel').owlCarousel({
      center: true,
      loop: true,
      margin: 30,
      autoplay: true,
      responsiveClass: true,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 },
      }
    });
    // Cleanup on unmount
    return () => {
      $(carouselRef.current).owlCarousel('destroy');
    };
  }, [data]);
  const getUserFromLocalStorage = () => {
    const userArray = JSON.parse(localStorage.getItem("customer"));
    return userArray && userArray.length > 0 ? userArray[0] : null;
  };
  const profileLink = (id) => {
    return id == getUserFromLocalStorage()?.id
      ? `/account/${id}`
      : `/follow/${id}`;
  };

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12">
              <div className="text-center mb-5 pb-2">
                <h1 className="text-white" style={{ fontSize: '58px', fontWeight: 'bold' }}>Foodcast Forum</h1>
                <p className="text-white">Nghe nó ở khắp mọi nơi. Khám phá podcast yêu thích của bạn.</p>
              </div>

              {/* <div className="owl-carousel owl-theme" ref={carouselRef}>
                {data.map((follow) => (
                  // <div key={follow.followed_id} className="item">
                  //   <h4>{follow.username}</h4>
                  // </div>
                  <div key={follow.followed_id} className="owl-carousel-info-wrap item">
                    <img
                      src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${follow.images}?alt=media`}
                      className="owl-carousel-image img-fluid"
                      alt="Chef"
                    />
                    <div className="owl-carousel-info">
                      <h4 className="mb-2">{follow.username}</h4>
                      <span className="badge">Đầu bếp</span>
                      <span className="badge">Ban giám khảo</span>
                    </div>
                    <div className="social-share">
                      <ul className="social-icon">
                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-linkedin">LinkedIn</a>
                        </li>
                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-whatsapp">WhatsApp</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))
                }
              </div> */}
              <div className="owl-carousel owl-theme " ref={carouselRef}>
                {data.map((follow) => (
                  <div key={follow.followed_id} className="owl-carousel-info-wrap item" >
                    <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${follow.images}?alt=media`} className="owl-carousel-image img-fluid" alt="Chef 1"
                      style={{
                        maxWidth: "auto",
                        height: "350px",
                        
                      }}
                    />
                    <div className="owl-carousel-info text-center">
                      <h4 className="mb-2">{follow.username}
                        {follow.isticket === "active" && (
                            <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fverified.png?alt=media&token=d2b88560-6930-47ad-90b1-7e29876d4d91" className="owl-carousel-verified-image img-fluid mx-2"
                              alt=""
                              style={{
                                width: '20px'
                              }} />
                          )}
                      </h4>

                    </div>
                    <div className="social-share">
                      <ul className="social-icon">
                        <li className="social-icon-item">
                          {/* <a href="#" class="social-icon-link bi-linkedin"></a> */}
                          {/* <a href="#" class="social-icon-link bi bi-info-circle-fill"></a> */}
                          <Link to={profileLink(follow.followed_id)} className="social-icon-link bi bi-info-circle-fill">
                          </Link>
                        </li>

                      </ul>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>
      <CategoriesHome />
      <Post />
    </>
  );
}

export default Home;
