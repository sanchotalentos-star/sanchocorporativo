export function memberKey(base: string): string {
  try {
    const u = JSON.parse(localStorage.getItem('mock_user') ?? 'null')
    if (u?.id && u.id !== 'member-3') return `${base}_${u.id}`
  } catch {}
  return base
}
