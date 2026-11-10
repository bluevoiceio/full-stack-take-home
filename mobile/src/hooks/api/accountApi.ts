import { useMutation, useQuery } from '@tanstack/react-query';

import { API } from '../../api/api';
import { showErrorToast } from '../../components/errorToast';
import { useAuthStore } from '../../store/useAuthStore';

export const useGetAccounts = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['auth', 'accounts'],
    queryFn: () => API.getAccounts(),
    select: response => response.data,
  });
  return { accounts: data ?? [], isLoading, isError, refetch };
};

export const useLogin = () => {
  const signIn = useAuthStore(state => state.signIn);
  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email }: { email: string }) => API.login({ email }),
    onSuccess: response => signIn(response.data),
    onError: error => showErrorToast({ title: 'Could not sign in', error }),
  });
  return { login, isPending };
};

export const useGetDepartment = () => {
  const departmentId = useAuthStore(state => state.user?.departmentId);
  const { data: department, isLoading } = useQuery({
    queryKey: ['departments', departmentId],
    queryFn: () => API.getDepartment({ departmentId: departmentId ?? '' }),
    enabled: !!departmentId,
    select: response => response.data,
  });
  return { department, isLoading };
};

export const useGetDepartmentUsers = () => {
  const departmentId = useAuthStore(state => state.user?.departmentId);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['departments', departmentId, 'users'],
    queryFn: () => API.getDepartmentUsers(),
    enabled: !!departmentId,
    select: response => response.data,
  });
  return { users: data ?? [], isLoading, refetch };
};
