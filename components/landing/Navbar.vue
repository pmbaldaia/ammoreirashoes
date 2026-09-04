<script setup lang="ts">
const open = ref(false)
const { settings, loadSettings } = usePublicContent()
const { isDark } = useThemeMode()
const route = useRoute()

await loadSettings()

const { data: menus, refresh: refreshMenus } = await useFetch<any[]>('/api/public/menus', {
  default: () => [],
  cache: 'no-cache',
  key: 'public-header-menus',
})

const links = computed(() =>
  (menus.value || [])
    // /api/public/menus already returns only public/active records.
    // Keep compatibility with older MongoDB menu rows that used status='published'
    // or did not yet have a location field. Re-filtering only status='active' here
    // made valid CMS menus disappear after deploy.
    .filter((item: any) => !item.location || item.location === 'header')
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
)

watch(
  () => route.fullPath,
  async () => {
    open.value = false
    // Keep CMS navigation fresh during client-side navigation without a hard refresh.
    await refreshMenus()
  },
)
</script>

<template>
  <div>
    <a class="skip-link" href="#main-content">Saltar para o conteúdo</a>
    <header class="am-nav">
      <div class="am-wrap am-nav__inner">
        <NuxtLink to="/" :aria-label="`${settings.name} — início`">
          <img
            class="am-nav__logo"
            :src="isDark ? '/brand/logo-branco.png' : '/brand/logo-preto.png'"
            :alt="settings.brand || settings.name"
          >
        </NuxtLink>

        <nav class="am-nav__links" aria-label="Navegação principal">
          <NuxtLink
            v-for="item in links"
            :key="item.id || `${item.label}-${item.url}`"
            :to="item.url"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="am-nav__actions">
          <ThemeToggle />
          <button class="am-menu" :aria-expanded="open" aria-label="Abrir menu" @click="open = !open">
            <Icon :name="open ? 'lucide:x' : 'lucide:menu'" size="26" />
          </button>
        </div>
      </div>

      <nav v-if="open" class="am-mobile-panel" aria-label="Navegação móvel">
        <NuxtLink
          v-for="item in links"
          :key="item.id || `${item.label}-${item.url}`"
          :to="item.url"
          @click="open = false"
        >
          {{ item.label }}
        </NuxtLink>
        <ThemeToggle :compact="false" />
      </nav>
    </header>
  </div>
</template>
