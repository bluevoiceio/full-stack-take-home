import { QueryClient } from '@tanstack/react-query';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

import { useAuthStore } from '@/store/authStore';

export const API_ORIGIN =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const fetchWithBaseUrl = axios.create({ baseURL: `${API_ORIGIN}/api/v1` });
export const fetchAuthApi = axios.create({ baseURL: `${API_ORIGIN}/auth` });

fetchWithBaseUrl.interceptors.response.use(undefined, error => {
  if (error.response?.status === 401) useAuthStore.getState().signOut();
  return Promise.reject(error);
});

export const fetchWithToken = <T>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const token = useAuthStore.getState().accessToken;
  if (!token) return Promise.reject(new Error('No access token available'));
  return fetchWithBaseUrl({
    ...config,
    headers: { Authorization: `Bearer ${token}`, ...config.headers },
  });
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
    mutations: { retry: false },
  },
});
