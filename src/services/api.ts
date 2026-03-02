/**
 * 攒钱记账 - Axios 实例与拦截器
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth';

// 后端 API 基础地址
export const BASE_URL = 'http://localhost:8080/v1';

// API 统一响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 创建 Axios 实例
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 是否正在刷新 Token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// 请求拦截器 - 自动附加 Token（仅当 token 存在时）
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && accessToken.trim() !== '' && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // 调试日志
    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 调试日志 + Token 过期自动刷新
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API] ✅ ${response.status} ${response.config.url}`, JSON.stringify(response.data).substring(0, 200));
    }
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    if (__DEV__) {
      console.log(`[API] ❌ ${error.config?.url}`, error.response?.status, JSON.stringify(error.response?.data || error.message).substring(0, 200));
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 如果是 401 且不是刷新 Token 请求本身
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/token/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        // 如果正在刷新，排队等待
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<ApiResponse>(
          `${BASE_URL}/auth/token/refresh`,
          { refreshToken }
        );

        const { token: newToken, refreshToken: newRefreshToken } =
          response.data.data;
        setTokens(newToken, newRefreshToken);
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * 解包 API 响应，提取 data 字段
 * 如果 code !== 0，抛出错误
 */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  let response;
  try {
    response = await promise;
  } catch (error: any) {
    // axios 网络 / HTTP 错误
    if (error.response) {
      const body = error.response.data;
      if (body && body.message) {
        throw new Error(body.message);
      }
      throw new Error(`请求失败 (${error.response.status})`);
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络');
    }
    if (error.message === 'Network Error') {
      throw new Error('网络错误，请检查网络连接');
    }
    throw error;
  }

  const apiResponse = response.data;

  // 服务端返回空响应
  if (!apiResponse) {
    throw new Error('服务器返回空响应');
  }

  // 业务错误
  if (apiResponse.code !== 0) {
    throw new Error(apiResponse.message || '请求失败');
  }

  return apiResponse.data;
}

export default api;

