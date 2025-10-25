import axios from "axios";

const apiClient = axios.create({
  baseURL : "https://skill-exchange-backend-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT Token to request headers if exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
