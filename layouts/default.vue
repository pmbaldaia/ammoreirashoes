<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/' || route.path === '')

// One public CMS/MongoDB round-trip per initial page load. All following
// client-side navigations reuse this state instead of waiting for several
// Netlify serverless calls before changing route.
const { load } = usePublicSiteData()
await load()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <LandingNavbar />

    <main id="main-content" :class="isHome ? 'site-main--home' : 'pt-20 sm:pt-24'">
      <slot />
    </main>

    <LandingFooter />
  </div>
</template>
