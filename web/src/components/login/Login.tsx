import { useMutation, useQuery } from '@tanstack/react-query';

import { Card } from '@/components/shared';
import { API_ORIGIN, fetchAuthApi } from '@/hooks/apiConfig';
import { useAuthStore } from '@/store/authStore';
import type { LoginResponse, User } from '@/types/api-types';
import { showErrorToast } from '@/utils/errorToast';
import { fullName } from '@/utils/format-utils';

// Stands in for real sign-in: pick one of the department's admins.
export const Login = () => {
  const signIn = useAuthStore(state => state.signIn);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['auth', 'accounts'],
    queryFn: () => fetchAuthApi.get<User[]>('/accounts'),
  });
  const admins = (data?.data ?? []).filter(user => user.role === 'admin');

  const { mutate: login, isPending } = useMutation({
    mutationFn: (email: string) =>
      fetchAuthApi.post<LoginResponse>('/login', { email }),
    onSuccess: response => signIn(response.data),
    onError: error => showErrorToast({ title: 'Could not sign in', error }),
  });

  return (
    <main className='flex min-h-dvh items-center justify-center p-6'>
      <Card className='w-full max-w-sm overflow-hidden'>
        <div className='border-b px-6 py-5'>
          <h1 className='text-xl font-bold tracking-tight'>Sign in</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Choose an admin account to continue.
          </p>
        </div>
        {isLoading && (
          <p className='px-6 py-6 text-sm text-muted-foreground'>Loading…</p>
        )}
        {isError && (
          <p className='px-6 py-6 text-sm text-muted-foreground'>
            Could not reach the API at {API_ORIGIN}. Is it running?
          </p>
        )}
        {admins.map(user => (
          <button
            key={user.id}
            type='button'
            disabled={isPending}
            onClick={() => login(user.email)}
            className='flex w-full items-center justify-between border-b px-6 py-3 text-left last:border-b-0 hover:bg-muted/50 disabled:opacity-50'
          >
            <span className='text-sm font-medium'>{fullName(user)}</span>
            <span className='text-xs text-muted-foreground'>{user.title}</span>
          </button>
        ))}
      </Card>
    </main>
  );
};
