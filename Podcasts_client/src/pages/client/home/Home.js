import React, { useEffect, useState } from "react";
import axios from "axios";
import './home.css';
import { Link } from 'react-router-dom';
import Post from '../post/Post'
import CategoriesHome from "../categories/CategoriesHome";

  function Home() {
    const [categories, setCategories] = useState([]);
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/categories"); 
        setCategories(response.data.data); 
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    useEffect(() => { 
      $('.owl-carousel').owlCarousel({
        center: true,
        loop: true,
        margin: 30,
        autoplay: true,
        responsiveClass: true,
        responsive: {
          0: {
            items: 2,
          },
          767: {
            items: 3,
          },
          1200: {
            items: 4,
          }
        }
      });
    }, []);
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

              <div className="owl-carousel owl-theme">
                <div className="owl-carousel-info-wrap item">
                  <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fchef-9.jpg?alt=media&token=7175dd11-65c5-4360-8fac-e8e43066aab5" className="owl-carousel-image img-fluid" alt=""/>

                    <div className="owl-carousel-info item">
                      <h4 className="mb-2">Gordon Ramsay
                        <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fverified.png?alt=media&token=d2b88560-6930-47ad-90b1-7e29876d4d91" className="owl-carousel-verified-image img-fluid"
                          alt=""/>

                      </h4>

                      <span className="badge">Đầu bếp</span>
                      <span className="badge">Ban giám khảo</span>
                    </div>

                    <div className="social-share">
                      <ul className="social-icon">
                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-linkedin"></a>
                        </li>

                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-whatsapp"></a>
                        </li>
                      </ul>
                    </div>
                </div>
                <div className="owl-carousel-info-wrap item">
                  <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fchef2.jpg?alt=media&token=ebc63f98-8efb-4a8c-8eee-443059c646ea" className="owl-carousel-image img-fluid" alt=""/>

                    <div className="owl-carousel-info">
                      <h4 className="mb-2">	Dương Huy Khải
                        <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fverified.png?alt=media&token=d2b88560-6930-47ad-90b1-7e29876d4d91" className="owl-carousel-verified-image img-fluid"
                          alt=""/>

                      </h4>

                      <span className="badge">Đầu bếp</span>
                
                    </div>

                    <div className="social-share">
                      <ul className="social-icon">
                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-linkedin"></a>
                        </li>

                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-whatsapp"></a>
                        </li>
                      </ul>
                    </div>
                </div>
                <div className="owl-carousel-info-wrap item">
                  <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fchef-5.jpg?alt=media&token=6fbc7150-b9d6-43c8-8e1d-404956a82b7f" className="owl-carousel-image img-fluid" alt=""/>

                    <div className="owl-carousel-info">
                      <h4 className="mb-2">	Michelin
                        <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fverified.png?alt=media&token=d2b88560-6930-47ad-90b1-7e29876d4d91" className="owl-carousel-verified-image img-fluid"
                          alt=""/>

                      </h4>

                      <span className="badge">Đầu bếp</span>
                    
                    </div>

                    <div className="social-share">
                      <ul className="social-icon">
                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-linkedin"></a>
                        </li>

                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-whatsapp"></a>
                        </li>
                      </ul>
                    </div>
                </div>
                <div className="owl-carousel-info-wrap item">
                  <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fchef-6.jpg?alt=media&token=f5f5b1e9-5dc8-4fb4-803c-2889c5cc732c" className="owl-carousel-image img-fluid" alt=""/>

                    <div className="owl-carousel-info">
                      <h4 className="mb-2">Lâm Hương
                        <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fverified.png?alt=media&token=d2b88560-6930-47ad-90b1-7e29876d4d91" className="owl-carousel-verified-image img-fluid"
                          alt=""/>

                      </h4>

                      <span className="badge">Đầu bếp</span>
                      
                    </div>

                    <div className="social-share">
                      <ul className="social-icon">
                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-linkedin"></a>
                        </li>

                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-whatsapp"></a>
                        </li>
                      </ul>
                    </div>
                </div>
                <div className="owl-carousel-info-wrap item">
                  <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fchef-7.jpg?alt=media&token=af07251e-5a89-47b2-8f1e-8fb2736ce39d" className="owl-carousel-image img-fluid" alt=""/>

                    <div className="owl-carousel-info">
                      <h4 className="mb-2">Schuttrump
                        <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fverified.png?alt=media&token=d2b88560-6930-47ad-90b1-7e29876d4d91" className="owl-carousel-verified-image img-fluid"
                          alt=""/>

                      </h4>

                      <span className="badge">Đầu bếp</span>
                      <span className="badge">Ban giám khảo</span>
                    </div>

                    <div className="social-share">
                      <ul className="social-icon">
                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-linkedin"></a>
                        </li>

                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-whatsapp"></a>
                        </li>
                      </ul>
                    </div>
                </div>
                <div className="owl-carousel-info-wrap item">
                  <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fchef-8.jpg?alt=media&token=9f34b6af-0a02-48f7-978a-6770e447e661" className="owl-carousel-image img-fluid" alt=""/>

                    <div className="owl-carousel-info">
                      <h4 className="mb-2">Jack Lee
                      

                      </h4>

                      <span className="badge">Đầu bếp</span>
                      
                    </div>

                    <div className="social-share">
                      <ul className="social-icon">
                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-linkedin"></a>
                        </li>

                        <li className="social-icon-item">
                          <a href="#" className="social-icon-link bi-whatsapp"></a>
                        </li>
                      </ul>
                    </div>
                </div>

        
              </div>
            </div>
          </div>
        </div>
      </section>
      <CategoriesHome/>
     {/* categories */}
     <Post />
    

    </>
  );
}

export default Home;
