export function useSeries() {
  const seriesList = ref<any[]>([])
  const currentSeries = ref<any>(null)
  const currentDoc = ref<any>(null)
  const loading = ref(false)

  async function fetchSeries() {
    loading.value = true
    try {
      const res = await $fetch('/api/series')
      seriesList.value = (res as any).data || []
    } finally { loading.value = false }
  }

  async function fetchSeriesBySlug(slug: string) {
    loading.value = true
    try {
      const res = await $fetch(`/api/series/${slug}`)
      currentSeries.value = (res as any).data
      return currentSeries.value
    } finally { loading.value = false }
  }

  async function fetchDoc(slug: string, docId: string) {
    loading.value = true
    try {
      const res = await $fetch(`/api/series/${slug}/docs/${docId}`)
      currentDoc.value = (res as any).data
      return currentDoc.value
    } finally { loading.value = false }
  }

  function buildTree(docs: any[]) {
    const map = new Map<string, any>()
    const roots: any[] = []
    const sorted = [...docs].sort((a, b) => a.order - b.order)
    for (const doc of sorted) {
      map.set(doc.id, { ...doc, children: [] })
    }
    for (const doc of sorted) {
      const node = map.get(doc.id)!
      if (doc.parentId && map.has(doc.parentId)) {
        map.get(doc.parentId)!.children.push(node)
      } else {
        roots.push(node)
      }
    }
    return roots
  }

  return { seriesList, currentSeries, currentDoc, loading, fetchSeries, fetchSeriesBySlug, fetchDoc, buildTree }
}
