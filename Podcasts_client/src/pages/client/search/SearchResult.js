import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function SearchResults() {
    const [results, setResults] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('messages');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/post_search?messages=${query}`);
                setResults(response.data.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    return (
        <section className="trending-podcast-section section-padding pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-12">
                        <div className="section-title-wrap mb-5 mt-3">
                            <h4 className="section-title">Chủ đề thịnh hành</h4>
                        </div>
                    </div>

                    {results.length > 0 ? (
                        results.map((post) => (
                            <div className="col-lg-4 col-12 mb-4 mb-lg-0 mt-2" key={post.id}>
                                <div className="custom-block custom-block-full">
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
                                            <Link to={`/getId_post/${post.id}`}>
                                                {post.title}
                                            </Link>
                                        </h5>

                                        <div className="profile-block d-flex">
                                            <img
                                                src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${post.images_customers}?alt=media`}
                                                style={{ height: '50px' }}
                                                className="profile-block-image img-fluid"
                                                alt={post.username}
                                            />
                                            <p>
                                                {post.username}
                                                <strong>Chuyên gia</strong> {/* Update based on your data */}
                                            </p>
                                        </div>

                                        <div className="custom-block-bottom d-flex justify-content-between mt-3">
                                            <a href="#" className="bi-headphones me-1">
                                                <span>{post.view}</span>
                                            </a>
                                            <a href="#" className="bi-heart me-1">
                                                <span>{post.likes}</span>
                                            </a>
                                            <a href="#" className="bi-chat me-1">
                                                <span>{post.total_comments}</span>
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
                    ) : (
                        <p>Không tìm thấy kết quả</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default SearchResults;
