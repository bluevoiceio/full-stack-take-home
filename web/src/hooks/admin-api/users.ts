import { useQuery } from '@tanstack/react-query';

import { fetchWithToken } from '@/hooks/apiConfig';
import { useActiveUser } from '@/hooks/useActiveUser';
import type { User } from '@/types/api-types';

const usersQueryKey = (departmentId?: string) => [
  'departments',
  departmentId,
  'users',
];

export const useGetUsersByDepartmentId = () => {
  const { departmentId } = useActiveUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: usersQueryKey(departmentId),
    queryFn: () => fetchWithToken<User[]>({ url: '/users', method: 'GET' }),
    enabled: !!departmentId,
  });
  return { users: data?.data ?? [], isLoading, isError };
};
