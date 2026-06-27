export default defineEventHandler(async (event) => {
  await requireScope(event, 'schedules:read')

  const raw: any[] = await $fetch('https://1music.245959623.xyz/api/songs/public')

  // group by playDate
  const map = new Map<string, any[]>()
  for (const item of raw) {
    const d = item.playDate
    if (!map.has(d)) map.set(d, [])
    map.get(d)!.push(item)
  }

  const schedules = Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({
      date,
      items: items.sort((a, b) => (a.sequence || 0) - (b.sequence || 0)),
      count: items.length,
    }))

  return { data: schedules, total: raw.length }
})
