type PublicSiteData = {
  pages: any[]
  contentBlocks: any[]
  products: any[]
  categories: any[]
  collections: any[]
  events: any[]
  gallery: any[]
  menus: any[]
  settings: any[]
}

const emptySiteData = (): PublicSiteData => ({
  pages: [],
  contentBlocks: [],
  products: [],
  categories: [],
  collections: [],
  events: [],
  gallery: [],
  menus: [],
  settings: [],
})

export const usePublicSiteData = () => {
  const data = useState<PublicSiteData>('public-site-data', emptySiteData)
  const loaded = useState<boolean>('public-site-data-loaded', () => false)
  const loadedAt = useState<number>('public-site-data-loaded-at', () => 0)

  const load = async (force = false) => {
    if (loaded.value && !force) return data.value

    const payload = await $fetch<PublicSiteData>('/api/public/site-data')
    data.value = { ...emptySiteData(), ...payload }
    loaded.value = true
    loadedAt.value = Date.now()
    return data.value
  }

  // Keep CMS changes reasonably fresh without making route navigation wait
  // for Netlify/MongoDB. Refresh happens in the background after 30 seconds.
  const refreshIfStale = async (maxAge = 30_000) => {
    if (!loaded.value || Date.now() - loadedAt.value >= maxAge) {
      return load(true)
    }
    return data.value
  }

  const pages = computed(() => data.value.pages || [])
  const contentBlocks = computed(() => data.value.contentBlocks || [])
  const products = computed(() => data.value.products || [])
  const categories = computed(() => data.value.categories || [])
  const collections = computed(() => data.value.collections || [])
  const events = computed(() => data.value.events || [])
  const gallery = computed(() => data.value.gallery || [])
  const menus = computed(() => data.value.menus || [])
  const settings = computed(() => data.value.settings || [])

  return {
    data,
    loaded,
    loadedAt,
    load,
    refreshIfStale,
    pages,
    contentBlocks,
    products,
    categories,
    collections,
    events,
    gallery,
    menus,
    settings,
  }
}
