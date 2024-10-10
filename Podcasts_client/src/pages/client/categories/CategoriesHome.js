import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CategoriesHome() {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [displayedCategories, setDisplayedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categories_All');
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
    if (showAll) {
      setDisplayedCategories(categories);
    } else {
      setDisplayedCategories(categories.slice(0, 3)); 
    }
  }, [showAll, categories]);

  const handleToggleClick = () => {
    setShowAll(!showAll);
  };

  return (
    <section className="trending-podcast-section  pt-0 p-0">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-12">
          <div className="section-title-wrap mb-5 mt-3">
            <h4 className="section-title">Thể loại</h4>
          </div>
        </div>
        {displayedCategories.map(category => (
          <div className="col-lg-4 col-12 mb-lg-0 mt-3" key={category.id}>
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
                <p className="mb-0" dangerouslySetInnerHTML={{ __html: category.description }}></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="d-flex justify-content-center mt-4">
      <button className="shadow" onClick={handleToggleClick}>
        <span>{showAll ? 'Ẩn bớt' : 'Xem thêm'}</span>
      </button>
    </div>
  </section>
  
  );
}

export default CategoriesHome;
