<script setup lang="ts">
await usePublicPage('produtos')
const { products: items } = usePublicSiteData()
</script>
<template><div class="am-site"><CmsManagedHeader page-slug="produtos"/><section class="am-section"><div class="am-wrap"><div v-if="items.length" class="am-grid"><article v-for="item in items" :key="item.id" class="am-card"><div class="am-card__image"><img :src="item.image" :alt="item.name" loading="lazy"></div><div class="am-card__body"><p class="am-kicker">{{item.reference}}</p><h2 style="font-size:1.5rem">{{item.name}}</h2><p>{{item.description}}</p><NuxtLink :to="`/contacto?produto=${item.id}`">Pedir informações →</NuxtLink></div></article></div></div></section></div></template>
