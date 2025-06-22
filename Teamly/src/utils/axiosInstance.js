import axios from "axios";
import { BASE_URL } from "./apiPaths.js";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (request) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken) request.headers.Authorization = `Bearer ${accessToken}`;
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if(error.response) {
            const status = error.response.status;
            if(status === 401) {
                window.location.href = "/login";
            }
            else if(status === 500) console.error("Server error. Please try again.");
        }
        else if(error.code === "ECONNABORTED") console.error("Request timeout. Please try again.");
        return Promise.reject(error);
    }
);

export default axiosInstance;