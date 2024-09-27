import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Progress } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import axiosInstance from '../firebase/axiosConfig';
import { storage } from '../firebase/firebase';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { DialogService } from "../../../services/common/DialogService";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import MyEditor from '../tinymce/tinymce';
import './post-user.css';
function PostUser() {
  const { id } = useParams();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  const [userId, setUserId] = useState(null);
  const [fileImg, setFileImg] = useState(null);
  const [fileAudio, setFileAudio] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [oldImage, setOldImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const [data, setData] = useState([]);
  const [editorContent, setEditorContent] = useState('');

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const getUserFromLocalStorage = () => {
    const userArray = JSON.parse(localStorage.getItem("customer"));
    return userArray && userArray.length > 0 ? userArray[0] : null;
  };
  const fetchPost = async () => {
    try {
      const getId = getUserFromLocalStorage();
      const idCustomer = getId ? getId.id : null;
      const response = await axios.get(`http://localhost:8080/api/post-customer/${idCustomer}`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    fetchPost();
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/categories_All");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();

    const info = localStorage.getItem('customer');
    if (info) {
      const customerArray = JSON.parse(info);
      if (Array.isArray(customerArray) && customerArray.length > 0) {
        const customer = customerArray[0];
        setUserId(customer.id);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/customers/${id}`);
        const user = response.data.data[0];
        setUserInfo(user);
        setOldImage(user.images);
        setValue('username', user.username);
        setValue('full_name', user.full_name);
        setValue('email', user.email);
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

  const onFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === 'images') {
        setFileImg(files[0]);
      } else if (name === 'audio') {
        setFileAudio(files[0]);
      }
    }
  };

  const uploadFile = async (file, path, setProgress) => {
    const fileRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);
    });

    await uploadTask;
    setProgress(100);
    return path.split('/').pop();
  };

  const onSubmit = async (formData) => {
    try {
      if (fileImg) {
        const imgExtension = fileImg.name.split('.').pop();
        const imgFileName = `${Date.now()}.${imgExtension}`;
        const imgPath = `upload/${imgFileName}`;
        formData.images = await uploadFile(fileImg, imgPath, setImgUploadProgress);
      }

      if (fileAudio) {
        const audioExtension = fileAudio.name.split('.').pop();
        const audioFileName = `${Date.now()}.${audioExtension}`;
        const audioPath = `audio/${audioFileName}`;
        formData.audio = await uploadFile(fileAudio, audioPath, setAudioUploadProgress);
      }
      formData.description = editorContent;
      formData.customers_id = userId;
      await axiosInstance.post('/api/post', formData);

      DialogService.success('Thêm thành công')
      await fetchPost();
      reset();
      handleClose();
      setImgUploadProgress(0); // Reset progress after successful upload
      setAudioUploadProgress(0);
    } catch (error) {
      console.error('Upload failed:', error);
      DialogService.error('Thêm thất bại');
    }
  };
  if (loading) return <Spinner />;
  return (
    <div className="timeline-body rounded">
      <div className="timeline-comment-box rounded">
        <div className="user mt-1">
          <img src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${oldImage}?alt=media`} alt="Hồ sơ" />
        </div>
        <div className="input row">
          <form action="" >
            {/* <div className="input-group" >
              <input type="text" className="form-control rounded-corner" placeholder="Thêm một bài viết..." onClick={() => setShowModal(true)} />
              <span className="input-group-btn p-l-10">
                <button className="btn btn-primary f-s-12 rounded-corner" type="button" onClick={() => setShowModal(true)}>Thêm bài viết</button>
              </span>
            </div> */}

            <div className="input-group-user input-group-post">
              <input
                type="text"
                className="input-post rounded-corner col-md-12 col-12 col-lg-10"
                placeholder="Thêm một bài viết..."
                onClick={() => setShowModal(true)}
              />
              <button
                className="button--submit col-md-12 col-12 col-lg-2"
                type="button"
                onClick={() => setShowModal(true)}
              >
                Thêm bài viết
              </button>
            </div>

          </form>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='row'>
              <div className='col-6'>
                <label>Tiêu đề</label>
                <input type='text' className='form-control'
                  id="title"
                  name="title"
                  placeholder="Tiêu đề..."
                  {...register('title', { required: true })} />
                {errors.title && <span className='text-danger'>Vui lòng nhập tiêu đề!</span>}
              </div>
              <div className='col-6'>
                <label>Hình ảnh</label>
                <input type='file' className='form-control'
                  id="images"
                  name="images"
                  accept="image/*"
                  onChange={onFileChange}
                />
                <Progress percent={imgUploadProgress} />
              </div>

              <div className='col-6'>
                <label>Audio</label>
                <input type='file' className='form-control'
                  id="audio"
                  name="audio"
                  accept="audio/*"
                  onChange={onFileChange}
                />
                <Progress percent={audioUploadProgress} />
              </div>
              <div className='col-6'>
                <label>Thể loại</label>
                <select
                  name="categories_id"
                  id="categories_id"
                  className='form-control'
                  style={{ width: '100%', fontSize: '1rem' }}
                  {...register('categories_id', { required: true })}
                >
                  <option value="">Vui lòng chọn loại!</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categories_id && <span className='text-danger'>Vui lòng chọn loại!</span>}
              </div>
              <div className='col-12'>
                <label>Mô tả</label>
                {/* <textarea className='form-control' placeholder='Mô tả...'
                  id="description"
                  name="description"
                  {...register('description')}
                ></textarea> */}<MyEditor onEditorChange={handleEditorChange} id="description"
                  name="description"
                  {...register('description')} />
              </div>
            </div>
            <div className="row">
              <div className="col text-end">
                <Button variant="secondary" className="mt-5 mx-1" onClick={() => setShowModal(false)}>
                  Hủy
                </Button>
                <Button variant="primary" type="submit" className="mt-5">
                  Thêm
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PostUser;
