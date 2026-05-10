import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 seconds timeout
  withCredentials: true, // This ensures cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add the token to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiRequest<T = any>(endpoint: string, options: any = {}): Promise<T> {
  try {
    console.log(`[API] Starting ${options.method || "GET"} ${endpoint}...`);
    const response = await api({
      url: endpoint,
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : undefined,
      ...options,
    });
    console.log(`[API] Success ${endpoint}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.warn(`[API] Error [${options.method || "GET"} ${endpoint}]:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    const message = error.response?.data?.message || "Something went wrong";
    throw new Error(message);
  }
}

export default api;
