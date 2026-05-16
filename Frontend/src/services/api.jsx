import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Response interceptor to handle authentication errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear user data from localStorage
      localStorage.removeItem("user");
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
