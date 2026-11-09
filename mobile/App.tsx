import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import type { Officer } from './src/api'
import { MyShifts } from './src/MyShifts'
import { OfficerPicker } from './src/OfficerPicker'
import { colors } from './src/theme'

export default function App() {
  const [officer, setOfficer] = useState<Officer | null>(null)

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        {officer ? (
          <MyShifts officer={officer} onSwitchOfficer={() => setOfficer(null)} />
        ) : (
          <OfficerPicker onSelect={setOfficer} />
        )}
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
})
