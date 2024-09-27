import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axiosInstance from '../firebase/axiosConfig';
import { DialogService } from "../../../services/common/DialogService";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase';
import Spinner from '../Spinner/Spinner';
import './follower.css' ;
function InfoUser() {
  
 
    return (
        /* From Uiverse.io by Javierrocadev */
        <div class="card-follow w-100 mb-5">
            <p class="title-follơ">Người theo dõi</p>
            <div class="user__container">
                <div class="user-follow">
                    <div class="image"></div>
                    <div class="user__content">
                        <div class="text">
                            <span class="name">Name</span>
                            <p class="username">@namedlorem</p>
                        </div>
                        <button class="follow">Follow</button>
                    </div>

                </div>
         

            </div>
            <a class="more" href="#">See more</a>
        </div>
    );
}

export default InfoUser;
