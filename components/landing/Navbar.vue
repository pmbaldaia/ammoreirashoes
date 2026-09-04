<script setup lang="ts">
const open = ref(false)
const { settings, loadSettings } = usePublicContent()
const { menus, load, refreshIfStale } = usePublicSiteData()
const { isDark } = useThemeMode()
const route = useRoute()

await Promise.all([load(), loadSettings()])

const links = computed(() =>
  (menus.value || [])
    .filter((item: any) => !item.location || item.location === 'header')
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
)

watch(
  () => route.fullPath,
  () => {
    // Route changes must be immediate. Navigation data is already in the
    // shared public-site cache, so there is no reason to refetch menus here.
    open.value = false
    void refreshIfStale()
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
