<script setup lang="ts">
definePageMeta({layout:'default'})
const route=useRoute()
const slug=computed(()=>Array.isArray(route.params.all)?route.params.all.join('/'):String(route.params.all||''))
await usePublicPage(slug.value)
</script>
<template><CmsPageRenderer v-if="slug" :page-slug="slug"/></template>
