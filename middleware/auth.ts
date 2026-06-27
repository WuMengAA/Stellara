export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  auth.loadFromStorage()

  if (!auth.isLoggedIn) {
    return navigateTo('/login')
  }
})
