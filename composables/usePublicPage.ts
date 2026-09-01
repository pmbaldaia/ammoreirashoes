/** Confirms that an explicit Nuxt route still has a published CMS page. */
export async function usePublicPage(slug: string) {
  const { data: pages } = await useFetch<any[]>('/api/public/pages', {
    default: () => [],
    cache: 'no-cache',
  })
  const page = computed(() => pages.value.find((item: any) => item.slug === slug))
  if (!page.value) throw createError({ statusCode: 404, message: 'Página não encontrada' })
  return page
}
