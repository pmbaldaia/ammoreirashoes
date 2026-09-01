<script setup lang="ts">
definePageMeta({layout:'default'})
const route=useRoute()
const slug=computed(()=>Array.isArray(route.params.all)?route.params.all.join('/'):String(route.params.all||''))
const {data:pages}=await useFetch('/api/public/pages',{default:()=>[]})
const exists=computed(()=>pages.value.some((page:any)=>page.slug===slug.value))
if(!exists.value) throw createError({statusCode:404,message:'Página não encontrada'})
</script>
<template><CmsPageRenderer v-if="slug" :page-slug="slug"/></template>
