import { useQuery } from '@tanstack/react-query';

import { fetchWithToken } from '@/hooks/apiConfig';
import { useActiveUser } from '@/hooks/useActiveUser';
import type { Department, Unit } from '@/types/api-types';

export const useGetDepartment = () => {
  const { departmentId } = useActiveUser();
  const { data, isLoading } = useQuery({
    queryKey: ['departments', departmentId],
    queryFn: () =>
      fetchWithToken<Department>({
        url: `/departments/${departmentId}`,
        method: 'GET',
      }),
    enabled: !!departmentId,
  });
  return { department: data?.data, isLoading };
};

export const useGetUnitsByDepartmentId = () => {
  const { departmentId } = useActiveUser();
  const { data, isLoading } = useQuery({
    queryKey: ['departments', departmentId, 'units'],
    queryFn: () => fetchWithToken<Unit[]>({ url: '/units', method: 'GET' }),
    enabled: !!departmentId,
  });
  return { units: data?.data ?? [], isLoading };
};
