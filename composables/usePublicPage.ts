/** Confirms that an explicit Nuxt route still has a published CMS page. */
export async function usePublicPage(slug: string) {
  const { pages, load } = usePublicSiteData()
  await load()
  const page = computed(() => pages.value.find((item: any) => item.slug === slug))
  if (!page.value) throw createError({ statusCode: 404, message: 'Página não encontrada' })
  return page
}
