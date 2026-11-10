import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DepartmentGroups } from '@/components/dashboard/groups/DepartmentGroups';
import { DashboardHome } from '@/components/dashboard/home/DashboardHome';
import { DepartmentNotifications } from '@/components/dashboard/notifications/DepartmentNotifications';
import { DepartmentUsers } from '@/components/dashboard/users/DepartmentUsers';
import { Login } from '@/components/login/Login';
import { queryClient } from '@/hooks/apiConfig';
import { useAuthStore } from '@/store/authStore';

export default function App() {
  const isSignedIn = useAuthStore(state => !!state.accessToken);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {isSignedIn ? (
          <Routes>
            <Route path='/dashboard' element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path='users' element={<DepartmentUsers />} />
              <Route path='groups' element={<DepartmentGroups />} />
              <Route
                path='notifications'
                element={<DepartmentNotifications />}
              />
            </Route>
            <Route path='*' element={<Navigate to='/dashboard' replace />} />
          </Routes>
        ) : (
          <Login />
        )}
      </BrowserRouter>
      <Toaster richColors position='top-right' />
    </QueryClientProvider>
  );
}
