export function useAuthFetch() {
  const auth = useAuthStore()

  return {
    get: async <T = any>(url: string, opts?: any): Promise<T> => {
      return $fetch(url, {
        ...opts,
        headers: { ...opts?.headers, Authorization: `Bearer ${auth.accessToken}` },
      })
    },
    post: async <T = any>(url: string, body?: any): Promise<T> => {
      return $fetch(url, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      })
    },
    patch: async <T = any>(url: string, body?: any): Promise<T> => {
      return $fetch(url, {
        method: 'PATCH',
        body,
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      })
    },
    delete: async <T = any>(url: string): Promise<T> => {
      return $fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      })
    },
  }
}
