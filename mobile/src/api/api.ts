import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform } from 'react-native';

import {
  Department,
  LoginResponse,
  Notification,
  User,
} from '../constants/types';
import { useAuthStore } from '../store/useAuthStore';

// The Android emulator reaches the host machine at 10.0.2.2. On a physical
// device, set EXPO_PUBLIC_API_URL to your computer's LAN address.
export const API_ORIGIN =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000');

const fetchWithBaseUrl = axios.create({ baseURL: `${API_ORIGIN}/api/v1` });
const fetchAuthApi = axios.create({ baseURL: `${API_ORIGIN}/auth` });

fetchWithBaseUrl.interceptors.response.use(undefined, error => {
  if (error.response?.status === 401) useAuthStore.getState().signOut();
  return Promise.reject(error);
});

const fetchWithToken = async <T>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new Error('No access token available');
  return await fetchWithBaseUrl({
    ...config,
    headers: { Authorization: `Bearer ${token}`, ...config.headers },
  });
};

// AUTH
const getAccounts = () => fetchAuthApi.get<User[]>('/accounts');

const login = ({ email }: { email: string }) =>
  fetchAuthApi.post<LoginResponse>('/login', { email });

// DEPARTMENT
const getDepartment = ({ departmentId }: { departmentId: string }) =>
  fetchWithToken<Department>({
    url: `/departments/${departmentId}`,
    method: 'GET',
  });

const getDepartmentUsers = () =>
  fetchWithToken<User[]>({ url: '/users', method: 'GET' });

// NOTIFICATIONS
const getUserNotifications = () =>
  fetchWithToken<Notification[]>({ url: '/notifications', method: 'GET' });

const setUserNotificationRead = ({
  notificationId,
  read,
}: {
  notificationId: string;
  read: boolean;
}) =>
  fetchWithToken<Notification>({
    url: `/notifications/${notificationId}`,
    method: 'PATCH',
    data: { read },
  });

const deleteUserNotification = ({
  notificationId,
}: {
  notificationId: string;
}) =>
  fetchWithToken<void>({
    url: `/notifications/${notificationId}`,
    method: 'DELETE',
  });

export const API = {
  getAccounts,
  login,
  getDepartment,
  getDepartmentUsers,
  getUserNotifications,
  setUserNotificationRead,
  deleteUserNotification,
};
