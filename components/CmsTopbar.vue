<script setup lang="ts">
defineEmits<{ menu: [] }>()

const menuOpen = ref(false)
const route = useRoute()
const { user, logout, authHeaders } = useAuth()
const toast = useToast()
const newContacts = ref(0)
let contactsTimer: ReturnType<typeof setInterval> | undefined

async function refreshNewContacts() {
  try {
    const contacts = await $fetch<any[]>('/api/contacts', { headers: authHeaders() })
    newContacts.value = contacts.filter((contact) => contact.status === 'new').length
  } catch {}
}
onMounted(() => {
  refreshNewContacts()
  contactsTimer = setInterval(refreshNewContacts, 5_000)
})
onBeforeUnmount(() => contactsTimer && clearInterval(contactsTimer))
watch(() => route.fullPath, refreshNewContacts)

const roleLabel = computed(() =>
  ({ admin: 'Administrador', viewer: 'Consulta e edição', commercial: 'Comercial' } as Record<string,string>)[user.value?.role || ''] || 'Utilizador'
)

const pageMeta = computed(() => {
  const path = route.path

  const map = [
    { test: (p:string) => p === '/admin', label: 'Painel de controlo', icon: 'lucide:layout-dashboard' },
    { test: (p:string) => p.startsWith('/admin/paginas'), label: 'Páginas', icon: 'lucide:file-text' },
    { test: (p:string) => p.startsWith('/admin/blocos'), label: 'Blocos de conteúdo', icon: 'lucide:blocks' },
    { test: (p:string) => p.startsWith('/admin/produtos'), label: 'Produtos', icon: 'lucide:package' },
    { test: (p:string) => p.startsWith('/admin/categorias'), label: 'Categorias', icon: 'lucide:tags' },
    { test: (p:string) => p.startsWith('/admin/colecoes'), label: 'Coleções', icon: 'lucide:book-open' },
    { test: (p:string) => p.startsWith('/admin/eventos'), label: 'Feiras e eventos', icon: 'lucide:calendar-days' },
    { test: (p:string) => p.startsWith('/admin/galeria'), label: 'Galeria', icon: 'lucide:images' },
    { test: (p:string) => p.startsWith('/admin/contactos'), label: 'Contactos', icon: 'lucide:messages-square' },
    { test: (p:string) => p.startsWith('/admin/menus'), label: 'Menus', icon: 'lucide:menu' },
    { test: (p:string) => p.startsWith('/admin/logs'), label: 'Histórico de alterações', icon: 'lucide:scroll-text' },
    { test: (p:string) => p.startsWith('/admin/media'), label: 'Multimédia', icon: 'lucide:image' },
    { test: (p:string) => p.startsWith('/admin/utilizadores'), label: 'Utilizadores', icon: 'lucide:key-round' },
    { test: (p:string) => p.startsWith('/admin/definicoes'), label: 'Informação da empresa', icon: 'lucide:settings-2' },
    { test: (p:string) => p.startsWith('/admin/pesquisa'), label: 'Resultados', icon: 'lucide:list-filter' },
  ]

  return map.find(item => item.test(path)) || {
    label: 'Administração',
    icon: 'lucide:layout-panel-left'
  }
})

async function handleLogout() {
  menuOpen.value = false
  toast.info('Sessão terminada', 'Até breve.')
  await logout()
}

function openSite() {
  window.open('/', '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <header class="cms-topbar">
    <div class="topbar-left">
      <button
        class="icon-button mobile-menu"
        type="button"
        aria-label="Abrir menu"
        @click="$emit('menu')"
      >
        <Icon name="lucide:menu" size="20" />
      </button>

      <div class="topbar-context" aria-label="Localização atual no CMS">
        <span class="topbar-context__icon">
          <Icon :name="pageMeta.icon" size="18" />
        </span>
        <div class="topbar-context__copy">
          <small>Administração</small>
          <strong>{{ pageMeta.label }}</strong>
        </div>
      </div>
    </div>

    <div class="topbar-actions">
      <button
        class="topbar-site-button"
        type="button"
        title="Abrir site público"
        @click="openSite"
      >
        <Icon name="lucide:external-link" size="16" />
        <span>Ver site</span>
      </button>

      <ThemeToggle />

      <NuxtLink
        to="/admin/contactos"
        class="icon-button notification-button"
        :aria-label="newContacts ? `${newContacts} contactos novos` : 'Mensagens'"
        title="Contactos"
      >
        <Icon name="lucide:mail" size="19" />
        <span v-if="newContacts" class="notification-count">{{ newContacts }}</span>
      </NuxtLink>

      <button class="user-menu" type="button" @click="menuOpen = !menuOpen">
        <span class="user-menu__avatar">
          <img v-if="user?.avatar" :src="user.avatar" alt="">
          <template v-else>{{ (user?.name || 'AD').slice(0, 2).toUpperCase() }}</template>
        </span>
        <span class="user-menu__copy">
          <strong>{{ user?.name || 'Administrador' }}</strong>
          <small>{{ roleLabel }}</small>
        </span>
        <Icon name="lucide:chevron-down" size="15" />
      </button>

      <div v-if="menuOpen" class="user-dropdown">
        <NuxtLink to="/admin/perfil" @click="menuOpen = false">
          <Icon name="lucide:user-round" />
          O meu perfil
        </NuxtLink>
        <NuxtLink to="/admin/contactos" class="mobile-menu-link" @click="menuOpen = false">
          <Icon name="lucide:mail" />
          Contactos
        </NuxtLink>
        <NuxtLink to="/admin/definicoes" @click="menuOpen = false">
          <Icon name="lucide:settings" />
          Definições
        </NuxtLink>
        <button type="button" @click="handleLogout">
          <Icon name="lucide:log-out" />
          Terminar sessão
        </button>
      </div>
    </div>
  </header>
</template>
