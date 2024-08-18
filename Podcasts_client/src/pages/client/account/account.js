import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axiosInstance from '../firebase/axiosConfig';
import { DialogService } from "../../../services/common/DialogService";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './account.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase';

function Account() {
  const { id } = useParams();
  const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [oldImage, setOldImage] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Khởi tạo state để kiểm soát việc hiển thị của ô nhập bình luận
  const [isCommentBoxVisible, setCommentBoxVisible] = useState(false);

  // Hàm xử lý khi nhấp vào liên kết bình luận
  const handleCommentClick = () => {
    setCommentBoxVisible(!isCommentBoxVisible);
  };
  const onSubmit = async (data) => {
    setIsUploading(true);
    if (file) {
      const fileExtension = file.name.split('.').pop();
      const currentDate = new Date();
      const newFileName = `${currentDate.toISOString().replace(/[:.]/g, '-')}.${fileExtension}`;
      const path = `upload/${newFileName}`;
      const storageRef = ref(storage, path);

      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        data.images = newFileName; // Set the new image URL
      } catch (error) {
        console.error('Upload failed:', error);
        DialogService.error('Upload failed. Please try again.');
        setIsUploading(false);
        return;
      }
    } else {
      data.images = oldImage;
    }
    data.isticket = 'inactive'; 
    data.date = new Date().toISOString();
    data.password = data.password || oldPassword;
    console.log('Data to submit:', data);

    try {
      data.role = 'user';
      const response = await axiosInstance.patch(`/api/customers/${id}`, data);
      if (response.status === 200) {
        DialogService.success('Cập nhật tài khoản thành công');
      }
    } catch (error) {
      console.error('Update failed:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 400) {
        DialogService.error('Username or email already exists.');
      } else {
        DialogService.error('Update failed. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching user info...");
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/customers/${id}`);
        console.log("User info received:", response.data.data);
        const user = response.data.data[0];
        setUserInfo(user);
        setOldImage(user.images);
        setOldPassword(user.password);
        setValue('username', user.username);
        setValue('full_name', user.full_name);
        setValue('email', user.email);
        // setValue('gender', user.gender.toString());
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [id, setValue]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col-md-12">
          <div className="content content-full-width">
            <div className="profile">
              <div className="profile-header">
                <div className="profile-header-cover"></div>
                <div className="profile-header-content">
                  <div className="profile-header-img rounded-circle">
                    <img
                      src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`}
                      alt="Hồ sơ"
                    />
                  </div>
                  <div className="profile-header-info">
                    <h4 className="m-t-10 m-b-5">{userInfo?.username}</h4>
                    <p className="m-b-10 text-white">Frontend</p>
                  </div>
                </div>
                <ul className="profile-header-tab nav nav-tabs mt-5">
                  <li className="nav-item">
                    <a id="posts-tab" data-bs-toggle="tab" href="#posts" role="tab" aria-controls="posts" aria-selected="false" className="nav-link ">BÀI VIẾT</a>
                  </li>
                  <li className="nav-item">
                    <a id="info-tab" data-bs-toggle="tab" href="#info" role="tab" aria-controls="info" aria-selected="true" target="__blank" className="nav-link show active">THÔNG TIN</a>
                  </li>
                  <li className="nav-item">
                    <a id="shares-tab" data-bs-toggle="tab" href="#shares" role="tab" aria-controls="shares" aria-selected="false" className="nav-link">CHIA SẺ</a>
                  </li>
                  <li className="nav-item">
                    <a id="favorites-tab" data-bs-toggle="tab" href="#favorites" role="tab" aria-controls="favorites" aria-selected="false" className="nav-link">YÊU THÍCH</a>
                  </li>
                </ul>

              </div>
            </div>
            <div className="profile-content">
              <div className="tab-content p-0">
                <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                  <div className="row gutters">
                    <div className="col-md-12">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                              <label htmlFor="username" className="form-label">Tên Người Dùng:</label>
                              <input
                                type="text"
                                className="form-control"
                                id="username"
                                disabled
                                value={userInfo ? userInfo.username : 'Đang Tải...'}
                              />
                            </div>
                            <div className="mb-3">
                              <label htmlFor="full_name" className="form-label">Họ Tên:</label>
                              <input
                                type="text"
                                className="form-control"
                                id="full_name"
                                {...register('full_name', { required: 'Họ tên là bắt buộc' })}
                              />
                              {errors.full_name && <span className="text-danger">{errors.full_name.message}</span>}
                            </div>
                            <div className="mb-3">
                              <label htmlFor="email" className="form-label">Email:</label>
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Địa chỉ email không hợp lệ' } })}
                              />
                              {errors.email && <span className="text-danger">{errors.email.message}</span>}
                            </div>
                            <div className="mb-3">
                              <label htmlFor="password" className="form-label">Mật Khẩu:</label>
                              <input
                                type="password"
                                className="form-control"
                                id="password"
                                {...register('password')}
                              />
                              {errors.password && <span className="text-danger">{errors.password.message}</span>}
                            </div>
                            <div className="mb-3">
                              <label htmlFor="confirm_password" className="form-label">Xác Nhận Mật Khẩu:</label>
                              <input
                                type="password"
                                className="form-control"
                                id="confirm_password"
                                {...register('confirm_password', { validate: value => value === watch('password') || 'Mật khẩu không khớp' })}
                              />
                              {errors.confirm_password && <span className="text-danger">{errors.confirm_password.message}</span>}
                            </div>
                            <div className="mb-3">
                              <label htmlFor="images" className="form-label">Hình Đại Diện:</label>
                              <input
                                type="file"
                                className="form-control"
                                id="images"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Giới Tính:</label><br />
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id="male"
                                  value="0"
                                  {...register('gender')}
                                  defaultChecked={userInfo && userInfo.gender === '0'}
                                />
                                <label className="form-check-label" htmlFor="male">Nam</label>
                              </div>
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id="female"
                                  value="1"
                                  {...register('gender')}
                                  defaultChecked={userInfo && userInfo.gender === '1'}
                                />
                                <label className="form-check-label" htmlFor="female">Nữ</label>
                              </div>
                            </div>
                            <div className="text-end">
                              <button type="submit" className="btn btn-primary" disabled={isUploading}>Cập Nhật Hồ Sơ</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* nội dung thông tin */}
                <div className="tab-pane fade" id="info" role="tabpanel" aria-labelledby="info-tab">
                  {/* <div className="tab-pane fade in active show" id="profile-about">
                    <div className="">
                      <table className="table table-profile">
                        <thead>
                          <tr>
                            <th></th>
                            <th>
                              <h4>Micheal Meyer <small>Lorraine Stokes</small></h4>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="highlight">
                            <td className="field">Tâm trạng</td>
                            <td><a href="javascript:;">Thêm tin nhắn tâm trạng</a></td>
                          </tr>
                          <tr className="divider">
                            <td colSpan="2"></td>
                          </tr>
                          <tr>
                            <td className="field">Di động</td>
                            <td>
                              +1-(847)- 367-8924 <a href="javascript:;" className="m-l-5">Chỉnh sửa</a>
                            </td>
                          </tr>
                          <tr>
                            <td className="field">Nhà</td>
                            <td><a href="javascript:;">Thêm số</a></td>
                          </tr>
                          <tr>
                            <td className="field">Văn phòng</td>
                            <td><a href="javascript:;">Thêm số</a></td>
                          </tr>
                          <tr className="divider">
                            <td colSpan="2"></td>
                          </tr>
                          <tr className="highlight">
                            <td className="field">Giới thiệu về tôi</td>
                            <td><a href="javascript:;">Thêm mô tả</a></td>
                          </tr>
                          <tr className="divider">
                            <td colSpan="2"></td>
                          </tr>
                          <tr>
                            <td className="field">Quốc gia/Vùng</td>
                            <td>
                              <select className="form-control input-inline input-xs" name="region">
                                <option value="US" selected>Hoa Kỳ</option>
                                <option value="AF">Afghanistan</option>
                                <option value="AL">Albania</option>
                                <option value="DZ">Algérie</option>
                                <option value="AS">American Samoa</option>
                                <option value="AD">Andorra</option>
                                <option value="AO">Angola</option>
                                <option value="AI">Anguilla</option>
                                <option value="AQ">Antarctica</option>
                                <option value="AG">Antigua và Barbuda</option>
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td className="field">Thành phố</td>
                            <td>Los Angeles</td>
                          </tr>
                          <tr>
                            <td className="field">Bang</td>
                            <td><a href="javascript:;">Thêm bang</a></td>
                          </tr>
                          <tr>
                            <td className="field">Website</td>
                            <td><a href="javascript:;">Thêm trang web</a></td>
                          </tr>
                          <tr>
                            <td className="field">Giới tính</td>
                            <td>
                              <select className="form-control input-inline input-xs" name="gender">
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td className="field">Ngày sinh</td>
                            <td>
                              <select className="form-control input-inline input-xs" name="day">
                                <option value="04" selected>04</option>
                              </select>
                              -
                              <select className="form-control input-inline input-xs" name="month">
                                <option value="11" selected>11</option>
                              </select>
                              -
                              <select className="form-control input-inline input-xs" name="year">
                                <option value="1989" selected>1989</option>
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td className="field">Ngôn ngữ</td>
                            <td>
                              <select className="form-control input-inline input-xs" name="language">
                                <option value="" selected>Tiếng Anh</option>
                              </select>
                            </td>
                          </tr>
                          <tr className="divider">
                            <td colSpan="2"></td>
                          </tr>
                          <tr className="highlight">
                            <td className="field">&nbsp;</td>
                            <td className="p-t-10 p-b-10">
                              <button type="submit" className="btn btn-primary width-150">Cập nhật</button>
                              <button type="submit" className="btn btn-white btn-white-without-border width-150 m-l-5">Hủy</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div> */}
                  <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                    <div className="row gutters">
                      <div className="col-md-12">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                              <div className="mb-3">
                                <label htmlFor="username" className="form-label">Tên Người Dùng:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="username"
                                  disabled
                                  value={userInfo ? userInfo.username : 'Đang Tải...'}
                                />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="full_name" className="form-label">Họ Tên:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="full_name"
                                  {...register('full_name', { required: 'Họ tên là bắt buộc' })}
                                />
                                {errors.full_name && <span className="text-danger">{errors.full_name.message}</span>}
                              </div>
                              <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  id="email"
                                  {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Địa chỉ email không hợp lệ' } })}
                                />
                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                              </div>
                              <div className="mb-3">
                                <label htmlFor="password" className="form-label">Mật Khẩu:</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="password"
                                  {...register('password')}
                                />
                                {errors.password && <span className="text-danger">{errors.password.message}</span>}
                              </div>
                              <div className="mb-3">
                                <label htmlFor="confirm_password" className="form-label">Xác Nhận Mật Khẩu:</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="confirm_password"
                                  {...register('confirm_password', { validate: value => value === watch('password') || 'Mật khẩu không khớp' })}
                                />
                                {errors.confirm_password && <span className="text-danger">{errors.confirm_password.message}</span>}
                              </div>
                              <div className="mb-3">
                                <label htmlFor="images" className="form-label">Hình Đại Diện:</label>
                                <input
                                  type="file"
                                  className="form-control"
                                  id="images"
                                  accept="image/*"
                                  onChange={(e) => setFile(e.target.files[0])}
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Giới Tính:</label><br />
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="male"
                                    value="0"
                                    {...register('gender')}
                                    defaultChecked={userInfo && userInfo.gender === '0'}
                                  />
                                  <label className="form-check-label" htmlFor="male">Nam</label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="female"
                                    value="1"
                                    {...register('gender')}
                                    defaultChecked={userInfo && userInfo.gender === '1'}
                                  />
                                  <label className="form-check-label" htmlFor="female">Nữ</label>
                                </div>
                              </div>
                              <div className="text-end">
                                <button type="submit" className="btn btn-primary" disabled={isUploading}>Cập Nhật Hồ Sơ</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* nôi dung bài đăng */}
                <div className="tab-pane fade" id="posts" role="tabpanel" aria-labelledby="posts-tab">
                  <div className="row">
                    <div className="col-md-12">
                      <div id="content" className="content content-full-width">
                        <div className="profile-content">
                          {/* bắt đầu nội dung tab */}
                          <div className="tab-content p-0">
                            {/* bắt đầu tab #profile-post */}
                            <div className="tab-pane fade active show" id="profile-post">
                              {/* bắt đầu timeline */}

                              <ul className="timeline">
                                <div className="timeline-body rounded">
                                  <div className="timeline-comment-box">
                                    <div className="user">
                                      <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`} alt="Hồ sơ" />
                                    </div>
                                    <div className="input">
                                      <form action="">
                                        <div className="input-group">
                                          <input type="text" className="form-control rounded-corner" onClick={handleShow} placeholder="Thêm một bài viết..." />
                                          <span className="input-group-btn p-l-10">
                                            <button className="btn btn-primary f-s-12 rounded-corner" type="button" onClick={handleShow}>Thêm bài viết</button>
                                          </span>
                                        </div>
                                      </form>
                                    </div>
                                  </div>

                                  {/* Component Modal */}
                                  <Modal show={showModal} onHide={handleClose} size="lg">
                                    <Modal.Header closeButton>
                                      <Modal.Title>Thêm bài viết</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      {/* Nội dung của Modal */}
                                      {/* <p>Hãy nhập nội dung bài viết của bạn ở đây.</p> */}
                                      <div className='row'>
                                        <div className='col-6'>
                                          <label>Tiêu đề</label>
                                          <input type='text' className='form-control' />
                                        </div>
                                        <div className='col-6'>
                                          <label>Hình ảnh</label>
                                          <input type='file' className='form-control' />
                                        </div>
                                        <div className='col-6'>
                                          <label>Audio</label>
                                          <input type='file' className='form-control' />
                                        </div>
                                        <div className='col-6'>
                                          <label>Thể loại</label>
                                          <select className='form-control' style={{ width: '100%', height: '2.5rem', fontSize: '1rem' }}>
                                            <option disabled selected>Vui lòng chọn loại!</option>
                                          </select>
                                        </div>
                                        <div className='col-12'>
                                          <label>Audio</label>
                                          <textarea className='form-control' placeholder='Mô tả...'></textarea>
                                        </div>
                                      </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button variant="secondary" onClick={handleClose}>
                                        Hủy
                                      </Button>
                                      <Button variant="primary" onClick={handleClose}>
                                        Thêm
                                      </Button>
                                    </Modal.Footer>
                                  </Modal>
                                </div>
                                <li>
                                  {/* bắt đầu thời gian trên timeline */}
                                  <div className="timeline-time">
                                    <span className="date">hôm nay</span>
                                    <span className="time">04:20</span>
                                  </div>
                                  {/* bắt đầu biểu tượng timeline */}
                                  <div className="timeline-icon">
                                    <a href="javascript:;">&nbsp;</a>
                                  </div>
                                  {/* bắt đầu nội dung timeline */}

                                  <div className="timeline-body border">

                                    <div className="timeline-header">
                                      <span className="userimage">
                                        <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`} alt="Hồ sơ" />
                                      </span>
                                      <span className="username mx-1">
                                        <a href="javascript:;">{userInfo?.username}</a>
                                      </span>
                                      <span className="pull-right text-muted">18 Lượt xem</span>
                                    </div>
                                    <div className="timeline-content">
                                      <p>
                                        Đã đăng 1 bài đăng...
                                      </p>
                                    </div>
                                    <div className="timeline-likes">
                                      <div className="stats-right">
                                        <span className="stats-text mx-1">259 Chia sẻ</span>
                                        <a href='#'><span className="stats-text">21 Bình luận</span></a>
                                      </div>
                                      <div className="stats">
                                        <span className="fa-stack fa-fw stats-icon">
                                          <i className="fa fa-circle fa-stack-2x text-danger"></i>
                                          <i className="fa fa-heart fa-stack-1x fa-inverse t-plus-1"></i>
                                        </span>
                                        <span className="fa-stack fa-fw stats-icon">
                                          <i className="fa fa-circle fa-stack-2x text-primary"></i>
                                          <i className="fa fa-thumbs-up fa-stack-1x fa-inverse"></i>
                                        </span>
                                        <span className="stats-total">4.3k</span>
                                      </div>
                                    </div>
                                    <div className="timeline-footer">
                                      <a href="javascript:;" className="m-r-15 text-inverse-lighter mx-1">
                                        <i class="bi bi-hand-thumbs-up"></i> Thích
                                      </a>
                                      <a href="javascript:;" className="m-r-15 text-inverse-lighter mx-1" onClick={handleCommentClick}>
                                        <i class="bi bi-chat"></i> Bình luận
                                      </a>
                                      <a href="javascript:;" className="m-r-15 text-inverse-lighter mx-1">
                                        {/* <i className="fa fa-share fa-fw fa-lg m-r-3"></i> Chia sẻ */}
                                        <i class="bi bi-share"></i> Chia sẻ
                                      </a>
                                    </div>
                                    {/* Khu vực nhập bình luận */}
                                    {isCommentBoxVisible && (
                                      <div className="timeline-comment-box">
                                        <div className="user">
                                          <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`} alt="Hồ sơ" />
                                        </div>
                                        <div className="input">
                                          <form action="">
                                            <div className="input-group">
                                              <input type="text" className="form-control rounded-corner" placeholder="Viết một bình luận..." />
                                              <span className="input-group-btn p-l-10">
                                                <button className="btn btn-primary f-s-12 rounded-corner" type="button">Bình luận</button>
                                              </span>
                                            </div>
                                          </form>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="tab-pane fade" id="shares" role="tabpanel" aria-labelledby="shares-tab">
                  <h3 className="mb-4">Chia sẻ</h3>
                  <p>hihi1</p>
                </div>

                <div className="tab-pane fade" id="favorites" role="tabpanel" aria-labelledby="favorites-tab">
                  <h3 className="mb-4">Yêu thích</h3>
                  <p>hihi?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Account;
