<script setup lang="ts">
const props = defineProps<{ pageSlug: string }>()
const { pages, contentBlocks, load } = usePublicSiteData()
await load()

const page = computed(() => pages.value.find((item: any) => item.slug === props.pageSlug))
const block = computed(() => contentBlocks.value.find((item: any) => item.pageSlug === props.pageSlug && item.type === 'page-header' && item.status === 'published'))

useHead(() => ({
  title: page.value?.seoTitle || page.value?.title || 'AM Moreira',
  meta: [
    { name: 'description', content: page.value?.metaDescription || '' },
    { name: 'robots', content: page.value?.indexable === false ? 'noindex, nofollow' : 'index, follow' },
  ],
}))
</script>

<template>
  <PublicPageHeader
    v-if="block"
    :kicker="block.eyebrow || ''"
    :title="block.title || page?.title || ''"
    :description="block.content || ''"
  />
</template>
