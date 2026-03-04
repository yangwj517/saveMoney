/**
 * 攒钱记账 - Axios 实例与拦截器
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth';
import { router } from 'expo-router';

// 后端 API 基础地址
export const BASE_URL = 'http://47.108.67.45:8080/v1';

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
    console.log('[API Request] 发送请求:', config.url, 'Token:', accessToken ? 'exists' : 'none');
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 调试日志 + Token 过期自动刷新（基于 code === 20005）
api.interceptors.response.use(
  async (response) => {
    if (__DEV__) {
      console.log(`[API] ✅ ${response.status} ${response.config.url}`, JSON.stringify(response.data).substring(0, 200));
    }
    
    // 检查响应体中的业务码是否为 20005（Token 过期）
    const responseCode = response.data?.code;
    console.log('[API Response] 响应码:', responseCode, 'URL:', response.config.url);
    
    // 如果是 20005，需要刷新 token
    if (responseCode === TOKEN_EXPIRED_CODE) {
      console.log('[API Response] 检测到 20005，开始处理刷新');
      
      const originalRequest = response.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      
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
      
      const { accessToken, refreshToken, setTokens, logout } = useAuthStore.getState();
      
      if (!refreshToken) {
        logout();
        return Promise.reject(new Error('没有 refreshToken，无法刷新'));
      }
      
      try {
        // 使用独立的 refreshApi 避免触发拦截器造成死循环
        // 但需要手动添加旧的 token 到 header
        console.log('[Token Refresh] 开始刷新 token...', { refreshToken: refreshToken ? 'exists' : 'missing' });
        const refreshResponse = await refreshApi.post<ApiResponse>(
          '/auth/token/refresh',
          { refreshToken },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        console.log('[Token Refresh] 刷新响应:', refreshResponse.data);
        
        // 检查刷新接口的响应码
        if (refreshResponse.data.code !== 0) {
          // 如果返回 20002，说明刷新失败（如 refreshToken 过期或无效）
          if (refreshResponse.data.code === TOKEN_REFRESH_FAILED_CODE) {
            handleTokenExpired();
            throw new Error('登录已过期，请重新登录');
          }
          throw new Error(refreshResponse.data.message || 'Token 刷新失败');
        }
        
        const { token: newToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;
        setTokens(newToken, newRefreshToken);
        processQueue(null, newToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        // 重试原请求
        console.log('[Token Refresh] 重试原请求');
        return api(originalRequest);
      } catch (refreshError) {
        // 如果是登录过期错误，直接抛出
        if ((refreshError as any).message === '登录已过期，请重新登录') {
          throw refreshError;
        }
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    console.log('[API Error Handler] 进入错误处理器');
    
    if (__DEV__) {
      console.log(`[API] ❌ ${error.config?.url}`, error.response?.status, JSON.stringify(error.response?.data || error.message).substring(0, 200));
    }
    
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    
    // 检查响应体中的 code 是否为 20005（Token 过期）
    const responseCode = error.response?.data?.code;
    console.log('[API Interceptor] 错误处理器响应码:', responseCode, 'URL:', originalRequest.url);
    
    if (
      responseCode === TOKEN_EXPIRED_CODE &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/token/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      console.log('[API Interceptor] 错误处理器检测到 20005，开始处理刷新');
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

      const { accessToken, refreshToken, setTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        // 使用独立的 refreshApi 避免触发拦截器造成死循环
        // 但需要手动添加旧的 token 到 header
        console.log('[Token Refresh] 开始刷新 token...', { refreshToken: refreshToken ? 'exists' : 'missing' });
        const response = await refreshApi.post<ApiResponse>(
          '/auth/token/refresh',
          { refreshToken },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        console.log('[Token Refresh] 刷新响应:', response.data);

        // 检查刷新接口的响应码
        if (response.data.code !== 0) {
          // 如果返回 20002，说明刷新失败（如 refreshToken 过期或无效）
          if (response.data.code === TOKEN_REFRESH_FAILED_CODE) {
            handleTokenExpired();
            throw new Error('登录已过期，请重新登录');
          }
          throw new Error(response.data.message || 'Token 刷新失败');
        }

        const { token: newToken, refreshToken: newRefreshToken } =
          response.data.data;
        setTokens(newToken, newRefreshToken);
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // 如果是登录过期错误，直接抛出
        if ((refreshError as any).message === '登录已过期，请重新登录') {
          throw refreshError;
        }
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

// Token 过期错误码
const TOKEN_EXPIRED_CODE = 20005;
// Token 刷新失败错误码
const TOKEN_REFRESH_FAILED_CODE = 20002;

// 创建 Axios 实例用于刷新 Token（不经过拦截器）
const refreshApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 处理登录过期，跳转到登录页
 */
const handleTokenExpired = () => {
  const { logout } = useAuthStore.getState();
  logout();
  // 延迟跳转，避免在请求中直接导航
  setTimeout(() => {
    router.replace('/login');
  }, 100);
};

/**
 * 解包 API 响应，提取 data 字段
 * 如果 code !== 0，抛出错误
 * 注意：code === 20005 会由拦截器自动处理刷新，不会到这里
 * 只有 code === 20002（刷新失败）才会跳转登录页
 */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  let response;
  try {
    response = await promise;
  } catch (error: any) {
    // axios 网络 / HTTP 错误
    if (error.response) {
      const body = error.response.data;
      
      // 注意：20005 已经被拦截器处理并尝试刷新，不会进入这里
      // 只有刷新失败返回 20002 才会进入这里
      if (body && body.code === TOKEN_REFRESH_FAILED_CODE) {
        handleTokenExpired();
        throw new Error('登录已过期，请重新登录');
      }
      
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

  // 注意：20005 已经被拦截器处理并尝试刷新，不会进入这里
  // 只有刷新失败返回 20002 才会进入这里
  if (apiResponse.code === TOKEN_REFRESH_FAILED_CODE) {
    handleTokenExpired();
    throw new Error('登录已过期，请重新登录');
  }

  // 业务错误
  if (apiResponse.code !== 0) {
    throw new Error(apiResponse.message || '请求失败');
  }

  return apiResponse.data;
}

export default api;

