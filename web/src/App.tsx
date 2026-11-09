import { useEffect, useState } from 'react'
import { API_URL, getDepartment, listOfficers, listShifts, type Officer, type Shift } from './api'
import { formatDay, formatTime } from './format'

type Schedule = { timeZone: string; officers: Map<number, Officer>; shifts: Shift[] }

function groupByDay(shifts: Shift[], timeZone: string) {
  const days = new Map<string, Shift[]>()
  for (const shift of shifts) {
    const day = formatDay(shift.starts_at, timeZone)
    days.set(day, [...(days.get(day) ?? []), shift])
  }
  return [...days.entries()]
}

export default function App() {
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      getDepartment(controller.signal),
      listOfficers(controller.signal),
      listShifts(controller.signal),
    ])
      .then(([department, officers, shifts]) => {
        setSchedule({
          timeZone: department.timezone,
          officers: new Map(officers.map((o) => [o.id, o])),
          shifts,
        })
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError(String(err))
      })
    return () => controller.abort()
  }, [])

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Schedule</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Shifts for this week and next, and the officers assigned to them.
        </p>
      </header>

      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Shifts</h2>
          {schedule && (
            <p className="mt-0.5 text-sm text-muted-foreground">Times in {schedule.timeZone}</p>
          )}
        </div>

        {error && (
          <p className="px-6 py-4 text-sm text-muted-foreground">
            Couldn't load the schedule from {API_URL}. Is the API running? ({error})
          </p>
        )}
        {!error && !schedule && <p className="px-6 py-4 text-sm text-muted-foreground">Loading…</p>}

        {schedule && (
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b">
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Officer</th>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Requires</th>
              </tr>
            </thead>
            {groupByDay(schedule.shifts, schedule.timeZone).map(([day, shifts]) => (
              <tbody key={day}>
                <tr className="border-b bg-muted">
                  <th colSpan={4} className="px-6 py-2 font-medium">
                    {day}
                  </th>
                </tr>
                {shifts.map((shift) => {
                  const officer = schedule.officers.get(shift.officer_id)
                  return (
                    <tr key={shift.id} className="border-b last:border-b-0">
                      <td className="px-6 py-3 tabular-nums">
                        {formatTime(shift.starts_at, schedule.timeZone)} –{' '}
                        {formatTime(shift.ends_at, schedule.timeZone)}
                      </td>
                      <td className="px-6 py-3">{officer?.name}</td>
                      <td className="px-6 py-3 text-muted-foreground">{officer?.title}</td>
                      <td className="px-6 py-3">
                        {shift.required_title && (
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {shift.required_title}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            ))}
          </table>
        )}
      </section>
    </main>
  )
}
