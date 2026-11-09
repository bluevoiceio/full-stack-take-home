import { Platform } from 'react-native'

// The Android emulator reaches the host machine at 10.0.2.2. On a physical
// device, set EXPO_PUBLIC_API_URL to your computer's LAN address.
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000')

export type Title = 'Officer' | 'Corporal' | 'Sergeant'

export type Department = {
  timezone: string
}

export type Officer = {
  id: number
  name: string
  title: Title
}

export type Shift = {
  id: number
  starts_at: string
  ends_at: string
  officer_id: number
  required_title: Title | null
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { signal })
  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`)
  }
  return response.json() as Promise<T>
}

export const getDepartment = (signal?: AbortSignal) => get<Department>('/department', signal)

export const listOfficers = (signal?: AbortSignal) => get<Officer[]>('/officers', signal)

export const listShifts = (officerId: number, signal?: AbortSignal) =>
  get<Shift[]>(`/shifts?officer_id=${officerId}`, signal)
