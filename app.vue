<script setup lang="ts">
useThemeMode()
const route = useRoute()
</script>

<template>
  <NuxtLayout>
    <!-- Force the public page tree to be recreated when the route changes.
         This prevents stale CMS content on Netlify client-side navigation. -->
    <NuxtPage :key="route.path" />
  </NuxtLayout>
</template>
