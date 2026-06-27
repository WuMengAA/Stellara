export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  const isLoggedIn = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    if (import.meta.client) {
      localStorage.setItem('accessToken', access)
      localStorage.setItem('refreshToken', refresh)
    }
  }

  function setUser(userData: any) {
    user.value = userData
    if (import.meta.client) {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  function loadFromStorage() {
    if (import.meta.client) {
      const access = localStorage.getItem('accessToken')
      const refresh = localStorage.getItem('refreshToken')
      const savedUser = localStorage.getItem('user')
      if (access) accessToken.value = access
      if (refresh) refreshToken.value = refresh
      if (savedUser) user.value = JSON.parse(savedUser)
    }
  }

  async function register(email: string, name: string, password: string) {
    const res = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email, name, password },
    }) as any
    setTokens(res.data.accessToken, res.data.refreshToken)
    setUser(res.data.user)
    return res
  }

  async function login(email: string, password: string) {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }) as any
    setTokens(res.data.accessToken, res.data.refreshToken)
    setUser(res.data.user)
    return res
  }

  async function refresh() {
    if (!refreshToken.value) return false
    try {
      const res = await $fetch('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken: refreshToken.value },
      }) as any
      setTokens(res.data.accessToken, res.data.refreshToken)
      setUser(res.data.user)
      return true
    } catch {
      logout()
      return false
    }
  }

  function logout() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    if (import.meta.client) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
    navigateTo('/')
  }

  return {
    user, accessToken, refreshToken,
    isLoggedIn, isAdmin,
    setTokens, setUser, loadFromStorage,
    register, login, refresh, logout,
  }
})
