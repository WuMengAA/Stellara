export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const preferences = user.preferences ? JSON.parse(user.preferences) : {}
  return apiSuccess({ preferences })
})
