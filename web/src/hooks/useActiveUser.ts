import { useAuthStore } from '@/store/authStore';

export const useActiveUser = () => {
  const user = useAuthStore(state => state.user);
  return { user, departmentId: user?.departmentId };
};
