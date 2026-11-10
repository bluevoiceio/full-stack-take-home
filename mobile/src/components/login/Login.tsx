import { FlatList, View } from 'react-native';

import { API_ORIGIN } from '../../api/api';
import { User } from '../../constants/types';
import { useGetAccounts, useLogin } from '../../hooks/api/accountApi';
import {
  Button,
  EmptyState,
  Icon,
  ListSkeleton,
  Logo,
  PageWrapper,
  SettingsCard,
  Text,
} from '../shared';
import { fullName } from '../utils';

// Stands in for real sign-in: pick anyone in the department.
export const Login = () => {
  const { accounts, isLoading, isError, refetch } = useGetAccounts();
  const { login, isPending } = useLogin();

  const renderAccount = ({ item }: { item: User }) => (
    <SettingsCard
      icon='person-circle-outline'
      title={fullName(item)}
      description={`${item.title} · ${item.employeeId}`}
      action={<Icon name='chevron-forward' size={20} color='mutedText' />}
      onPress={isPending ? undefined : () => login({ email: item.email })}
    />
  );

  return (
    <PageWrapper>
      <FlatList
        data={accounts}
        keyExtractor={account => account.id}
        renderItem={renderAccount}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, gap: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 10, paddingBottom: 10 }}>
            <Logo variant='withText' />
            <Text variant='subtitle2' align='center' color='subtleText'>
              Pick an account to sign in.
            </Text>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <ListSkeleton />
          ) : isError ? (
            <EmptyState
              icon='cloud-offline-outline'
              title='Could not reach the API'
              caption={`Is it running at ${API_ORIGIN}?`}
              action={
                <Button label='Try again' size='sm' onPress={() => refetch()} />
              }
            />
          ) : undefined
        }
      />
    </PageWrapper>
  );
};
