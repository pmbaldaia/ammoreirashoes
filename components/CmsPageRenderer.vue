<script setup lang="ts">
const props = withDefaults(defineProps<{ pageSlug?: string }>(), { pageSlug: '' })
const [{ data: pages }, { data: blocks }, { data: products }, { data: events }] = await Promise.all([
  useFetch('/api/public/pages', { default: () => [] }), useFetch('/api/public/contentBlocks', { default: () => [] }),
  useFetch('/api/public/products', { default: () => [] }), useFetch('/api/public/events', { default: () => [] }),
])
const page = computed(() => pages.value.find((item: any) => item.slug === props.pageSlug))
// An orphaned content block must not keep a deleted/unpublished page available.
if (!page.value) throw createError({ statusCode: 404, message: 'Página não encontrada' })
const visibleBlocks = computed(() => blocks.value.filter((item: any) => item.pageSlug === props.pageSlug && item.status === 'published').sort((a: any, b: any) => (a.order || 0) - (b.order || 0)))
const featuredProducts = computed(() => products.value.filter((item: any) => item.featured).slice(0, 3).length ? products.value.filter((item: any) => item.featured).slice(0, 3) : products.value.slice(0, 3))
const featuredEvents = computed(() => events.value.filter((item: any) => item.featured).slice(0, 3).length ? events.value.filter((item: any) => item.featured).slice(0, 3) : events.value.slice(0, 3))
const action = (value: string) => { const [label, url] = String(value).split('|'); return { label, url: url || '#' } }
useHead(() => ({ title: page.value?.seoTitle || page.value?.title || 'AM Moreira', meta: [{ name: 'description', content: page.value?.metaDescription || '' }, { name: 'robots', content: page.value?.indexable === false ? 'noindex, nofollow' : 'index, follow' }], link: page.value?.canonical ? [{ rel: 'canonical', href: page.value.canonical }] : [] }))
</script>

<template>
  <div class="am-site">
    <template v-for="block in visibleBlocks" :key="block.id">
      <section v-if="block.type === 'hero'" class="am-hero" :style="block.image ? { backgroundImage: `linear-gradient(90deg,rgba(15,13,11,.88),rgba(15,13,11,.18)),url('${block.image}')` } : {}">
        <div class="am-wrap am-hero__layout">
          <div class="am-hero__content"><p class="am-kicker">{{ block.eyebrow }}</p><h1>{{ block.title }}</h1><p>{{ block.content }}</p><div v-if="block.items?.length" class="am-actions"><NuxtLink v-for="(raw, index) in block.items" :key="raw" :class="['am-btn', { 'am-btn--light': index > 0 }]" :to="action(raw).url">{{ action(raw).label }}</NuxtLink></div></div>
        </div>
      </section>
      <PublicPageHeader v-else-if="block.type === 'page-header'" :kicker="block.eyebrow || ''" :title="block.title || ''" :description="block.content || ''" />
      <section v-else-if="['text', 'text-image', 'image-text'].includes(block.type)" class="am-section"><div class="am-wrap" :class="block.type === 'text' ? '' : 'am-split'"><div :style="block.type === 'image-text' ? { order: 2 } : {}"><p class="am-kicker">{{ block.eyebrow }}</p><h2>{{ block.title }}</h2><p style="white-space:pre-line">{{ block.content }}</p></div><div v-if="block.image" class="am-split__visual" :style="block.type === 'image-text' ? { order: 1 } : {}"><img :src="block.image" :alt="block.title || ''" loading="lazy"></div></div></section>
      <section v-else-if="block.type === 'products'" class="am-section am-section--sand"><div class="am-wrap"><div class="am-section__head"><div><p class="am-kicker">{{ block.eyebrow }}</p><h2>{{ block.title }}</h2></div><p>{{ block.content }}</p></div><div v-if="featuredProducts.length" class="am-grid"><article v-for="item in featuredProducts" :key="item.id" class="am-card"><div class="am-card__image"><img :src="item.image" :alt="item.name" loading="lazy"></div><div class="am-card__body"><h3>{{ item.name }}</h3><p>{{ item.description }}</p></div></article></div></div></section>
      <section v-else-if="block.type === 'events'" class="am-section"><div class="am-wrap"><div class="am-section__head"><div><p class="am-kicker">{{ block.eyebrow }}</p><h2>{{ block.title }}</h2></div><p>{{ block.content }}</p></div><div v-if="featuredEvents.length" class="am-grid"><article v-for="item in featuredEvents" :key="item.id" class="am-card"><div class="am-card__body"><p class="am-kicker">{{ item.city }}<template v-if="item.fairDays?.length"> · Dias {{ item.fairDays.join(', ').replace(/, ([^,]*)$/, ' e $1') }}</template><template v-else-if="item.startDate"> · {{ item.startDate }}</template></p><h3>{{ item.name }}</h3><p>{{ item.description }}</p></div></article></div></div></section>
      <section v-else-if="block.type === 'form'" class="am-section am-contact"><div class="am-wrap am-contact__grid"><div><p class="am-kicker">{{ block.eyebrow }}</p><h2>{{ block.title }}</h2><p>{{ block.content }}</p></div><ContactForm /></div></section>
      <section v-else-if="block.type === 'cta'" class="am-section am-section--sand"><div class="am-wrap"><p class="am-kicker">{{ block.eyebrow }}</p><h2>{{ block.title }}</h2><p>{{ block.content }}</p><NuxtLink v-if="block.items?.[0]" class="am-btn" :to="action(block.items[0]).url" style="margin-top:24px">{{ action(block.items[0]).label }}</NuxtLink></div></section>
    </template>
    <section v-if="!visibleBlocks.length" class="am-section am-empty-section"><div class="am-wrap am-empty">Esta página ainda não tem blocos publicados.</div></section>
  </div>
</template>
