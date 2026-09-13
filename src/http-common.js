import axios from "axios";

const http = axios.create({
  // baseURL: "https://college-backend.netlify.app/",
  baseURL: "http://localhost:5000/Attendance",
  headers: {
    "Content-type": "application/json",
  },
});

/**
 * Request interceptor — attaches role and (for students) their MongoDB ID
 * so the backend RBAC + studentOnly middleware can authorise every request.
 * Public routes (/checkEmail, /logout) ignore these headers gracefully.
 */
http.interceptors.request.use((config) => {
  const role = sessionStorage.getItem("role");
  const id   = sessionStorage.getItem("userId");

  if (role) {
    config.headers["X-User-Role"] = role;
  }
  if (id) {
    // Used by studentOnly middleware (X-Student-Id) and analytics (X-User-Id)
    config.headers["X-User-Id"] = id;
  }
  if (role === "student" && id) {
    config.headers["X-Student-Id"] = id;
  }

  return config;
});

export default http;
