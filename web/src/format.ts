// Shift times are shown in the department's time zone, not the viewer's.

export const formatDay = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone,
  }).format(new Date(iso))

export const formatTime = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone,
  }).format(new Date(iso))
