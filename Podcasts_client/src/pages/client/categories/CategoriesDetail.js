import React from 'react';
import './details.css'
function CategoriesDetail() {
    // Replace the EJS variables with their respective JavaScript counterparts
    const userId = undefined; // Example: replace with actual user ID logic
    const commentsList = []; // Example: replace with actual comments list logic

    const handleSubmit = (event) => {
        event.preventDefault();
        // Implement form submission logic here
    };

    return (
        <>
            <header className="site-header d-flex flex-column justify-content-center align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-12 text-center">
                            <h2 className="mb-0">CHI TIẾT</h2>
                        </div>
                    </div>
                </div>
            </header>

            <section className="latest-podcast-section section-padding pb-0" id="section_2">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-12">
                            <div className="section-title-wrap mb-5">
                                <h4 className="section-title">Bài đăng</h4>
                            </div>

                            <div className="row">
                                <div className="col-lg-3 col-12">
                                    <div className="custom-block-icon-wrap">
                                        <div className="custom-block-image-wrap custom-block-image-detail-page">
                                            <img
                                                src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F2024-06-23T14%3A40%3A34.669Z.jpg?alt=media&token=e56f877d-977a-4081-9d6e-4ad5e65c5b7e`}
                                                className="custom-block-image img-fluid" alt="" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-9 col-12">
                                    <div className="custom-block-info">
                                        <div className="custom-block-top d-flex mb-1">
                                            <small>
                                                <i className="bi-clock-fill custom-icon"></i>
                                                10 phút
                                            </small>
                                        </div>
                                        <h2 className="mb-2">Thức ăn nhanh</h2>
                                        <p>Thức ăn nhanh được mọi người ưa thích.</p>
                                        <div className="mt-5">
                                            <audio className="w-100" controls loop
                                                src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F2024-06-23T14%3A40%3A34.669Z.jpg?alt=media&token=e56f877d-977a-4081-9d6e-4ad5e65c5b7e`}>
                                            </audio>
                                        </div>
                                        <div className="profile-block profile-detail-block d-flex flex-wrap align-items-center mt-5">
                                            <div className="d-flex mb-3 mb-lg-0 mb-md-0">
                                                <img
                                                    src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F2024-06-23T16%3A36%3A16.088Z.jpg?alt=media&token=3fcf238e-0058-40c0-b15d-5867d5586cf5`}
                                                    className="profile-block-image img-fluid" alt="" />
                                                <p>
                                                    Denek
                                                    <img src="/styles/images/verified.png" className="verified-image img-fluid" alt="" />
                                                    <strong>Người đăng</strong>
                                                </p>
                                            </div>
                                            <ul className="social-icon ms-lg-auto ms-md-auto">
                                                <li className="social-icon-item">
                                                    <a href="#" className="social-icon-link bi-facebook"></a>
                                                </li>
                                                <li className="social-icon-item">
                                                    <a href="#" className="social-icon-link bi-instagram"></a>
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
                </div>
            </section>

            <section className="related-podcast-section section-padding">
                <div className="container">
                    <div className="row mt-5">
                        <div className="section-title-wrap">
                            <h4 className="section-title">Bình luận của bạn</h4>
                        </div>

                        {typeof userId === 'undefined' ? (
                            <div className="col-lg-7 col-7 mt-5">
                                <form action="/client/comments" method="post" id="comment-form" name="comment-form" className="comment-form">
                                    <div className="rating d-flex justify-content-center">
                                        <input type="radio" id="star-1" name="rating" value="5" />
                                        <label htmlFor="star-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                                            </svg>
                                        </label>
                                        <input type="radio" id="star-2" name="rating" value="4" />
                                        <label htmlFor="star-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                                            </svg>
                                        </label>
                                        <input type="radio" id="star-3" name="rating" value="3" />
                                        <label htmlFor="star-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                                            </svg>
                                        </label>
                                        <input type="radio" id="star-4" name="rating" value="2" />
                                        <label htmlFor="star-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                                            </svg>
                                        </label>
                                        <input type="radio" id="star-5" name="rating" value="1" />
                                        <label htmlFor="star-5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                                            </svg>
                                        </label>
                                    </div>

                                    <span className="error text-danger"></span> <br />
                                    <input type="hidden" name="product_id" />
                                    <input type="hidden" name="user_id" />
                                    <input type="hidden" name="date" />
                                    <textarea name="contents" id="contents" className="form-control" rows="3" placeholder="Bình luận của bạn"></textarea> <br />
                                    <span className="error text-danger"></span> <br /> <br />
                                    <div className="d-flex justify-content-end">
                                        <button className='shadow '>
                                            <div className="svg-wrapper-1">
                                                <div className="svg-wrapper">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                                        <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <span>Đăng</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12 col-12 text-center mt-3">
                                        <a href="/client/form/login" className="btn btn btn-outline-dark">Đăng nhập để bình luận</a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Existing comments list code */}
                    </div>
                </div>
            </section>
        </>
    )
}

export default CategoriesDetail;
