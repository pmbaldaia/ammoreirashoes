<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const labels: Record<string,string> = {
  admin: 'Painel',
  blocos: 'Blocos de conteúdo',
  paginas: 'Páginas',
  menus: 'Menus',
  produtos: 'Produtos',
  categorias: 'Categorias',
  colecoes: 'Coleções',
  eventos: 'Feiras e eventos',
  galeria: 'Galeria',
  contactos: 'Mensagens',
  media: 'Multimédia',
  utilizadores: 'Utilizadores',
  definicoes: 'Definições',
  logs: 'Histórico de alterações',
  perfil: 'O meu perfil',
}
const crumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  if (!parts.length || parts[0] !== 'admin') return []
  const result: { label:string; to?:string }[] = [{ label: 'Painel', to: '/admin' }]
  if (parts.length > 1) {
    result.push({ label: labels[parts[1]] || parts[1].replace(/-/g,' ') })
  }
  return result
})
const canGoBack = computed(() => route.path !== '/admin')
function goBack(){
  if (window.history.length > 1) router.back()
  else navigateTo('/admin')
}
</script>

<template>
  <div v-if="crumbs.length" class="cms-navigation-bar">
    <button v-if="canGoBack" type="button" class="cms-back-button" @click="goBack">
      <Icon name="lucide:arrow-left" />
      <span>Voltar atrás</span>
    </button>
    <nav class="cms-breadcrumb" aria-label="Breadcrumb">
      <template v-for="(crumb,index) in crumbs" :key="`${crumb.label}-${index}`">
        <Icon v-if="index" name="lucide:chevron-right" class="cms-breadcrumb__separator" />
        <NuxtLink v-if="crumb.to && index < crumbs.length-1" :to="crumb.to">{{ crumb.label }}</NuxtLink>
        <span v-else :aria-current="index===crumbs.length-1?'page':undefined">{{ crumb.label }}</span>
      </template>
    </nav>
  </div>
</template>
