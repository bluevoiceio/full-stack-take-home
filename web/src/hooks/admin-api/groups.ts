import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { fetchWithToken, queryClient } from '@/hooks/apiConfig';
import { useActiveUser } from '@/hooks/useActiveUser';
import type { GroupResponse } from '@/types/api-types';
import { parseAxiosError, showErrorToast } from '@/utils/errorToast';

const groupsQueryKey = (departmentId?: string) => [
  'departments',
  departmentId,
  'groups',
];

export const useGetGroupsByDepartmentId = () => {
  const { departmentId } = useActiveUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: groupsQueryKey(departmentId),
    queryFn: () =>
      fetchWithToken<GroupResponse[]>({ url: '/groups', method: 'GET' }),
    enabled: !!departmentId,
  });
  return { groups: data?.data ?? [], isLoading, isError };
};

interface SaveGroupVariables {
  group: GroupResponse | null;
  name: string;
  memberIds: string[];
}

// One save covers create and edit: write the name, then send the membership difference.
export const useSaveGroup = () => {
  const { departmentId } = useActiveUser();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ group, name, memberIds }: SaveGroupVariables) => {
      const { data: saved } = await fetchWithToken<GroupResponse>(
        group
          ? { url: `/groups/${group.id}`, method: 'PATCH', data: { name } }
          : { url: '/groups', method: 'POST', data: { name } },
      );
      const current = saved.members.map(member => member.id);
      const toAssign = memberIds.filter(id => !current.includes(id));
      const toUnassign = current.filter(id => !memberIds.includes(id));
      if (toAssign.length)
        await fetchWithToken({
          url: `/groups/${saved.id}/assign`,
          method: 'POST',
          data: { userIds: toAssign },
        });
      if (toUnassign.length)
        await fetchWithToken({
          url: `/groups/${saved.id}/unassign`,
          method: 'POST',
          data: { userIds: toUnassign },
        });
      return saved;
    },
    onSuccess: (_, { group, name }) =>
      toast.success(
        `Success: ${group ? 'Updated' : 'Created'} group ${name.trim()}`,
      ),
    onError: error => {
      // A 409 is shown inline on the name field instead.
      if (parseAxiosError(error).status !== 409)
        showErrorToast({ title: 'Could not save the group', error });
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: groupsQueryKey(departmentId),
      }),
  });
  return { saveGroup: mutateAsync, isPending };
};

export const useDeleteGroup = () => {
  const { departmentId } = useActiveUser();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ group }: { group: GroupResponse }) =>
      fetchWithToken({ url: `/groups/${group.id}`, method: 'DELETE' }),
    onSuccess: (_, { group }) => {
      queryClient.invalidateQueries({ queryKey: groupsQueryKey(departmentId) });
      toast.success(`Success: Deleted group ${group.name}`);
    },
    onError: error =>
      showErrorToast({ title: 'Could not delete the group', error }),
  });
  return { deleteGroup: mutate, isPending };
};
