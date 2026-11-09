import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { API_URL, listOfficers, type Officer } from './api'
import { colors, radius } from './theme'

type Props = { onSelect: (officer: Officer) => void }

export function OfficerPicker({ onSelect }: Props) {
  const [officers, setOfficers] = useState<Officer[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    listOfficers(controller.signal)
      .then(setOfficers)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError(String(err))
      })
    return () => controller.abort()
  }, [])

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Who are you?</Text>
      <Text style={styles.subtitle}>Pick an officer to see their shifts.</Text>

      {error && (
        <Text style={styles.message}>
          Couldn't reach the API at {API_URL}. Is it running? ({error})
        </Text>
      )}
      {!error && !officers && <ActivityIndicator color={colors.primary} />}

      {officers && (
        <FlatList
          data={officers}
          keyExtractor={(officer) => String(officer.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelect(item)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.title}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '600', color: colors.foreground },
  subtitle: { marginTop: 4, marginBottom: 20, fontSize: 14, color: colors.mutedForeground },
  message: { fontSize: 14, color: colors.mutedForeground },
  list: { gap: 8 },
  row: {
    padding: 16,
    borderRadius: radius * 1.5,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  rowPressed: { backgroundColor: colors.muted },
  name: { fontSize: 16, fontWeight: '600', color: colors.foreground },
  meta: { marginTop: 2, fontSize: 14, color: colors.mutedForeground },
})
