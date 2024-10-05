// services/api.js
import axios from "axios";

// Thiết lập axios với baseURL
const api = axios.create({
  baseURL: "http://localhost:5000", // Đường dẫn API từ backend
  timeout: 1000,
  headers: { Authorization: "Bearer yourToken" }, // nếu cần thêm token
});

export default api;
