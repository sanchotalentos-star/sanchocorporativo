// Maps admin/mentor IDs back to the member ID used when they were mentees,
// so data written before the role change remains accessible.
const ADMIN_MEMBER_ALIAS: Record<string, string> = {
  'mentor-2': 'member-2', // wladsonsidney@gmail.com
  'mentor-3': 'member-2', // wladson@sanchocorporativo.com.br
}

export function memberKey(base: string): string {
  try {
    const u = JSON.parse(localStorage.getItem('mock_user') ?? 'null')
    if (u?.id) {
      const effectiveId = ADMIN_MEMBER_ALIAS[u.id] ?? u.id
      if (effectiveId !== 'member-3') return `${base}_${effectiveId}`
    }
  } catch {}
  return base
}
