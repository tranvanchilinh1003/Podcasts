import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import elsa from '../../../assets/client/styles/images/profile/woman-posing-black-dress-medium-shot.jpg';
import { API_ENDPOINT } from "../../../config/api-endpoint.config";
function Categories() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [showAll, setShowAll] = useState(false); // State to control whether to show all posts

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_ENDPOINT.auth.base}/product/${id}`);
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchCategories();
    }, [id]); // Ensure id is included in the dependency array

    const handleLikeClick = (event) => {
        event.preventDefault();
        // Implement like functionality here
    };

    return (
        <section className="trending-podcast-section section-padding pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-12">
                        <div className="section-title-wrap mb-5 mt-3">
                            <h4 className="section-title">Chủ đề thịnh hành</h4>
                        </div>
                    </div>

                    {data.length === 0 ? (
                        <div className="col-12">
                            <p>Loại này chưa có sản phẩm.</p>
                        </div>
                    ) : (
                        data.map((post) => (
                            <div className="col-lg-4 col-12 mb-4 mb-lg-0" key={post.id}>
                                <div className="custom-block custom-block-full mt-2">
                                    <div className="custom-block-image-wrap">
                                        <Link to={`/getId_post/${post.id}`}>
                                            <img
                                                src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.images}?alt=media`}
                                                className="custom-block-image img-fluid"
                                                alt={post.title}
                                            />
                                        </Link>
                                    </div>

                                    <div className="custom-block-info">
                                        <h5 className="mb-2">
                                           
                                        </h5>

                                        <div className="profile-block d-flex">
                                            <img
                                                src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.images_customers}?alt=media`} // Update this if you have dynamic profile images
                                                style={{ height: '50px' }}
                                                className="profile-block-image img-fluid"
                                                alt={post.username}
                                            />
                                            <p>
                                                {post.username}
                                                <strong>Chuyên gia</strong> {/* Update based on your data */}
                                            </p>
                                        </div>

                                        {/* Assuming post.description exists */}

                                        <div className="custom-block-bottom d-flex justify-content-between mt-3">
                                            <a href="#" className="bi-headphones me-1">
                                                <span>{post.view}</span>
                                            </a>
                                            <a href="#" className="bi-heart me-1" onClick={handleLikeClick}>
                                                <span>{post.likes}</span> {/* Assuming post.likes exists */}
                                            </a>
                                            <div id="message"></div>
                                            <a href="#" className="bi-chat me-1">
                                                <span>{post.comments}</span> {/* Assuming post.comments exists */}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="social-share d-flex flex-column ms-auto">
                                        <a href="#" className="badge ms-auto">
                                            <i className="bi-heart"></i>
                                        </a>
                                        <a href="#" className="badge ms-auto">
                                            <i className="bi bi-share-fill"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default Categories;
