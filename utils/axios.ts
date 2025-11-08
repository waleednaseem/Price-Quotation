import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";
import { notifyError } from "./toast";

export const api = axios.create({
  baseURL: "https://mock.local/api",
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("mock_token");
  if (token) {
    // Ensure headers object exists and set Authorization consistently
    config.headers = config.headers || {} as any;
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  // Simulate latency for demo purposes
  return new Promise((resolve) => setTimeout(() => resolve(config), 300));
});

api.interceptors.response.use(
  async (response) => {
    // Simulate post-processing
    await new Promise((r) => setTimeout(r, 200));
    return response;
  },
  (error) => {
    notifyError(error?.message || "Network error");
    return Promise.reject(error);
  }
);

export default api;