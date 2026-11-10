import { FlatList, Pressable, View } from 'react-native';

import { API_ORIGIN } from '../../api/api';
import { User } from '../../constants/types';
import { useGetAccounts, useLogin } from '../../hooks/api/accountApi';
import { useThemeStore } from '../../store/useThemeStore';
import { Button, EmptyState, ListSkeleton, PageWrapper, Text } from '../shared';
import { fullName } from '../utils';

// Stands in for real sign-in: pick anyone in the department.
export const Login = () => {
  const themeColors = useThemeStore(s => s.themeColors);
  const { accounts, isLoading, isError, refetch } = useGetAccounts();
  const { login, isPending } = useLogin();

  const renderAccount = ({ item }: { item: User }) => (
    <Pressable
      disabled={isPending}
      onPress={() => login({ email: item.email })}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: themeColors.border,
        backgroundColor: pressed ? themeColors.border : themeColors.card,
      })}
    >
      <View style={{ flex: 1 }}>
        <Text variant='subtitle1' weight='semibold'>
          {fullName(item)}
        </Text>
        <Text color='mutedText'>{item.title}</Text>
      </View>
      <Text variant='caption' color='mutedText'>
        {item.employeeId}
      </Text>
    </Pressable>
  );

  return (
    <PageWrapper title='Who are you?' subtitle='Pick an account to sign in.'>
      <FlatList
        data={accounts}
        keyExtractor={account => account.id}
        renderItem={renderAccount}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          gap: 10,
        }}
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
