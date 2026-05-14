import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {},
});

// Automatically add the token to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically redirect to login if the session is invalid or expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const currentPath = window.location.pathname;

      const isDashboardPath = currentPath.startsWith('/dashboard') ||
        currentPath.startsWith('/billing') ||
        currentPath.startsWith('/settings') ||
        currentPath.startsWith('/workspaces');

      if (isDashboardPath) {
        console.warn("Session invalid. Redirecting to login...");
        window.location.href = '/login';
      }

    }
    return Promise.reject(error);
  }
);

export async function apiRequest<T = any>(endpoint: string, options: any = {}): Promise<T> {
  try {
    console.log(`[API] Starting ${options.method || "GET"} ${endpoint}...`);
    const requestData = options.data || options.body;
    const response = await api({
      url: endpoint,
      method: options.method || "GET",
      data: requestData instanceof FormData
        ? requestData
        : (typeof requestData === 'string' ? JSON.parse(requestData) : requestData),
      headers: {
        ...options.headers,
      },
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
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;
    const message = backendMessage || error.message || "Something went wrong";

    const detailedError = status
      ? `API Error ${status}: ${message}`
      : `Network Error: ${message}`;
    throw new Error(detailedError);
  }
}

export default api;
