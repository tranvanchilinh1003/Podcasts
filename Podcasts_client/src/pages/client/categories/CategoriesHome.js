import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';
import { API_ENDPOINT } from '../../../config/api-endpoint.config';
function CategoriesHome() {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [displayedCategories, setDisplayedCategories] = useState([]);
  const carouselRef = useRef(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT.auth.base}/categories_All`);
        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
          setDisplayedCategories(response.data.data.slice(0, 3));
        } else {
          console.error('Expected an array but got:', response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {

    $('.owl-carousel').owlCarousel({
      center: true,
      loop: true,
      margin: 30,
      autoplay: true,
      responsiveClass: true,
      dots: false,
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
  }, [categories]);
  useEffect(() => {
    if (showAll) {
      setDisplayedCategories(categories);
    } else {
      setDisplayedCategories(categories.slice(0, 3));
    }
  }, [showAll, categories]);

  const truncateTextWithHtml = (html, maxLength) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;

    const text = tempElement.innerText || tempElement.textContent;
    if (text.length <= maxLength) return html;

    let truncatedText = text.substr(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(" ");
    if (lastSpaceIndex > 0) {
      truncatedText = truncatedText.substr(0, lastSpaceIndex);
    }
    const truncatedHtml = document.createElement("div");
    truncatedHtml.innerHTML = tempElement.innerHTML;
    const trimmedHtml = truncatedHtml.innerHTML.substr(0, truncatedText.length);

    return trimmedHtml + "...";
  };


  return (
    <section className="trending-podcast-section pt-0">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-12">
            <div className="section-title-wrap mb-4 mt-3">
              <h4 className="section-title">Thể loại</h4>
            </div>
          </div>
          <div className="owl-carousel owl-theme mb-5" ref={carouselRef}>
            {categories.map(category => (
              <div key={category.id} className='mb-lg-0 owl-carousel-info-wrap item'>
                <div className="custom-block custom-block-full">
                  <div className="custom-block-image-wrap">
                    <Link to={`/categories/${category.id}`}>
                      <img
                        src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${category.images}?alt=media&token=c6dc72e8-a1b0-41bb-b1f3-3f7397e9`}
                        className="custom-block-image img-fluid"
                        alt={category.name}
                      />
                    </Link>
                  </div>
                  <div className="custom-block-info">
                    <h5 className="mb-2">
                      <Link to={`/categories/${category.id}`}>{category.name}</Link>
                    </h5>
                    <p className="description-text">
                      {expandedPostId === category.id ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: category.description,
                          }}
                        />
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: truncateTextWithHtml(
                              category.description,
                              100
                            ),
                          }}
                        />
                      )}{" "}
                      {category.description.length > 100 && (
                        <span
                          className="read-more-toggle"
                          onClick={() =>
                            setExpandedPostId(
                              expandedPostId === category.id
                                ? null
                                : category.id
                            )
                          }
                        >
                          {expandedPostId === category.id
                            ? "Ẩn bớt"
                            : "Xem thêm"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

export default CategoriesHome;
