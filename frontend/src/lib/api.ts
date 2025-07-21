import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://nivox-personal-blog-platform-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add access token, but skip for logout
api.interceptors.request.use((config) => {
  if (config.url === "/auth/logout") {
    return config; // Skip adding access token for logout
  }
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Interceptor to add access token to all requests
// api.interceptors.request.use((config) => {
//   const accessToken = localStorage.getItem("accessToken");
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// export default api;