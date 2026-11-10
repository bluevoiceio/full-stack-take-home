import { useMutation, useQuery } from '@tanstack/react-query';

import { Button, Card, Logo } from '@/components/shared';
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
    <main className='flex min-h-dvh items-center justify-center bg-background p-4'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='flex justify-center'>
          <Logo variant='withText' />
        </div>
        <Card className='overflow-hidden'>
          <div className='flex flex-col space-y-1.5 p-6 pb-4'>
            <h1 className='text-center text-lg leading-none font-semibold tracking-tight text-balance'>
              Sign in
            </h1>
            <p className='text-center text-sm text-muted-foreground'>
              Choose an admin account to continue.
            </p>
          </div>
          <div className='space-y-2 p-6 pt-0'>
            {isLoading && (
              <p className='text-center text-sm text-muted-foreground'>
                Loading…
              </p>
            )}
            {isError && (
              <p className='rounded-md border p-3 text-center text-sm text-balance text-muted-foreground'>
                Could not reach the API at {API_ORIGIN}. Is it running?
              </p>
            )}
            {admins.map(user => (
              <Button
                key={user.id}
                variant='secondary'
                fullWidth
                disabled={isPending}
                onClick={() => login(user.email)}
                className='px-4'
              >
                <span className='flex-1 text-left'>{fullName(user)}</span>
                <span className='text-xs font-normal text-muted-foreground'>
                  {user.title}
                </span>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
};
