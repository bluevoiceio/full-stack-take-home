import { parseAxiosError, showToast } from './utils';

// Every failure the user didn't cause goes through here, so they all read the same way.
export const showErrorToast = ({
  title,
  error,
}: {
  title: string;
  error: unknown;
}) => {
  const { status, message } = parseAxiosError(error);
  showToast({
    variant: 'error',
    title: status === undefined ? 'Connection problem' : title,
    caption:
      status === undefined
        ? 'Please check your connection and that the API is running.'
        : (message ?? 'Please try again.'),
  });
};
