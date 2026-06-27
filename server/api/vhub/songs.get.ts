export default defineEventHandler(async (event) => {
  await requireScope(event, 'songs:read')

  const data = await $fetch('https://1music.245959623.xyz/api/songs/public')
  return data
})
