import axios from "axios";
import Swal from "sweetalert2";
import { redirectToLogin } from './Pages/Navigation';

const axiosInstance = axios.create({
  // baseURL: "https://reiosglobal.com/Printsmy_Backend/api/",
  // baseURL: "https://kitecareer.com/Printmys-Backend/api/",
  // baseURL: "http://192.168.1.226:8000/api/", 
// baseURL: "https://kitecareer.com/watsmyapi/api/",
baseURL: "http://127.0.0.1:8000/api",
headers: {
  'Content-Type': 'application/json',
},
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    else if (config.url !== '/auth/login') {
      // Swal.fire({
      //  title: "Error",
        // text: "Session expired. Please log in again.",
      //  text: "No token found.",
        // icon: "error",
        // confirmButtonText: "OK"
      // }).then(() => {
        redirectToLogin();
      // });
      // redirectToLogin();
       throw new axios.Cancel('No token found'); // Cancel the request
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response.status === 401) {
     // Swal.fire("Error", "Session expired. Please log in again.", "error");
      // Swal.fire("Error", "No token found");
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;