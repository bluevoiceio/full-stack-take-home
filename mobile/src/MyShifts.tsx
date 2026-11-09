import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { API_URL, getDepartment, listShifts, type Officer, type Shift } from './api'
import { formatDay, formatTime } from './format'
import { colors, radius } from './theme'

type Props = { officer: Officer; onSwitchOfficer: () => void }

type Data = { timeZone: string; shifts: Shift[] }

export function MyShifts({ officer, onSwitchOfficer }: Props) {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([getDepartment(controller.signal), listShifts(officer.id, controller.signal)])
      .then(([department, shifts]) => setData({ timeZone: department.timezone, shifts }))
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError(String(err))
      })
    return () => controller.abort()
  }, [officer.id])

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>My shifts</Text>
          <Text style={styles.subtitle}>
            {officer.name} · {officer.title}
          </Text>
        </View>
        <Pressable onPress={onSwitchOfficer} style={styles.button} hitSlop={8}>
          <Text style={styles.buttonText}>Switch</Text>
        </Pressable>
      </View>

      {error && (
        <Text style={styles.message}>
          Couldn't reach the API at {API_URL}. Is it running? ({error})
        </Text>
      )}
      {!error && !data && <ActivityIndicator color={colors.primary} />}

      {data && (
        <FlatList
          data={data.shifts}
          keyExtractor={(shift) => String(shift.id)}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            <Text style={styles.footnote}>Times in {data.timeZone}</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.day}>{formatDay(item.starts_at, data.timeZone)}</Text>
              <Text style={styles.time}>
                {formatTime(item.starts_at, data.timeZone)} – {formatTime(item.ends_at, data.timeZone)}
              </Text>
              {item.required_title && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.required_title}</Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerText: { flex: 1 },
  title: { fontSize: 24, fontWeight: '600', color: colors.foreground },
  subtitle: { marginTop: 4, fontSize: 14, color: colors.mutedForeground },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  buttonText: { fontSize: 14, fontWeight: '500', color: colors.foreground },
  message: { fontSize: 14, color: colors.mutedForeground },
  list: { gap: 8 },
  card: {
    padding: 16,
    borderRadius: radius * 1.5,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  day: { fontSize: 14, color: colors.mutedForeground },
  time: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius - 2,
    backgroundColor: colors.primaryTint,
  },
  badgeText: { fontSize: 12, fontWeight: '500', color: colors.primary },
  footnote: { marginTop: 8, fontSize: 12, color: colors.mutedForeground, textAlign: 'center' },
})
