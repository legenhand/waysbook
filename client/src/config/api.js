import axios from 'axios';

export const API = axios.create({
    baseURL: 'http://ec2-108-137-76-240.ap-southeast-3.compute.amazonaws.com:5000/api/v1/',
});

export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
};