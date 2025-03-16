import React, { useEffect, useState } from 'react';
import styles from "./transactionSuccessful.module.css";
import { SiTicktick } from "react-icons/si";
import axiosInstance from '../../interceptor';
import { url } from '../../util/Url';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function OAuthSuccessful() {

    const { login } = useAuth();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const param = queryParams.get('token');
    const navigate = useNavigate() ; 

    useEffect(() => {
        if (param) {
            login(param) ; 
            navigate("/home")

        }
    }, [])
    return (
      <></>
    );
}

export default OAuthSuccessful;
