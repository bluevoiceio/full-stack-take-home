import { isAxiosError } from 'axios';
import { toast } from 'sonner';

export const parseAxiosError = (error: unknown) => {
  if (!isAxiosError(error)) return { status: undefined, message: undefined };
  const body = error.response?.data as
    { message?: string; detail?: string; code?: string } | undefined;
  return {
    status: error.response?.status,
    code: body?.code,
    message: body?.message ?? body?.detail,
  };
};

// Every failure the user didn't cause goes through here, so they all read the same way.
export const showErrorToast = ({
  title,
  error,
}: {
  title: string;
  error: unknown;
}) => {
  const { status, message } = parseAxiosError(error);
  const description =
    status === undefined
      ? 'Please check your connection and that the API is running.'
      : (message ?? 'Please try again.');
  toast.error(title, { description });
};
