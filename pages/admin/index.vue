<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const api = useApi()
const resources = ['pages', 'products', 'collections', 'events', 'contacts']
const rows = await Promise.all(resources.map(async (resource) => {
  try { return { resource, items: await api<any[]>(`/api/${resource}`) } }
  catch { return { resource, items: [] as any[] } }
}))

const details: Record<string, string> = { pages: 'Páginas configuradas', products: 'Produtos no catálogo', collections: 'Coleções publicadas', events: 'Feiras e eventos', contacts: 'Pedidos recebidos' }
const labels: Record<string, string> = { pages: 'Páginas', products: 'Produtos', collections: 'Coleções', events: 'Feiras', contacts: 'Contactos' }
const icons: Record<string, string> = { pages: 'lucide:file-text', products: 'lucide:package', collections: 'lucide:book-open', events: 'lucide:calendar-days', contacts: 'lucide:messages-square' }
const tones: Record<string, 'primary' | 'success' | 'warning' | 'info'> = { pages: 'info', products: 'primary', collections: 'success', events: 'warning', contacts: 'primary' }
const stats = rows.filter(({ resource }) => resource !== 'contacts').map(({ resource, items }) => ({ label: labels[resource], value: items.length, detail: details[resource], icon: icons[resource], tone: tones[resource] }))
const newContacts = rows.find(({ resource }) => resource === 'contacts')?.items.filter((item: any) => item.status === 'new') || []
</script>

<template>
  <div class="page-stack">
    <section class="page-heading">
      <div><p class="eyebrow">Visão geral</p><h1>Painel de controlo</h1><p class="page-heading__description">Resumo rápido do conteúdo do site AM Moreira.</p></div>
      <div class="page-heading__actions"><NuxtLink class="btn btn--primary" to="/admin/paginas?new=1"><Icon name="lucide:plus" />Nova página</NuxtLink></div>
    </section>
    <section class="stats-grid"><CmsStatCard v-for="stat in stats" :key="stat.label" v-bind="stat" /></section>
    <section class="dashboard-grid">
      <article class="panel quick-actions"><div class="panel__header"><div><h2>Ações rápidas</h2><p>Gerir conteúdo essencial</p></div></div><NuxtLink class="quick-action" to="/admin/produtos?new=1"><span><Icon name="lucide:package-plus" /></span><div><strong>Adicionar produto</strong><small>Novo item no catálogo</small></div></NuxtLink><NuxtLink class="quick-action" to="/admin/eventos?new=1"><span><Icon name="lucide:calendar-plus" /></span><div><strong>Adicionar feira</strong><small>Agenda da marca</small></div></NuxtLink><NuxtLink class="quick-action" to="/admin/media"><span><Icon name="lucide:image-plus" /></span><div><strong>Carregar imagens</strong><small>Biblioteca de imagens e documentos</small></div></NuxtLink></article>
      <article class="panel"><div class="panel__header"><div><h2>Novos contactos</h2><p>Pedidos por analisar</p></div><NuxtLink v-if="newContacts.length" class="text-button" to="/admin/contactos">Ver todos</NuxtLink></div><div v-if="newContacts.length" class="dashboard-contacts"><p v-for="item in newContacts.slice(0, 5)" :key="item.id"><strong>{{ item.name }}</strong> · {{ item.subject }}</p></div><div v-else class="empty-state"><h3>Tudo tratado</h3><p>Não existem novos pedidos.</p></div></article>
    </section>
  </div>
</template>
