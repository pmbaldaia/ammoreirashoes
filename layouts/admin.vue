<script setup lang="ts">
import '~/assets/css/admin.css'
import '~/assets/css/admin-am-shoes.css'
import '~/assets/css/ui-polish.css'
useHead({ titleTemplate: (title) => title ? `${title} · AM Moreira CMS` : 'AM Moreira CMS' })
const sidebarOpen = ref(false)
</script>

<template>
  <div class="cms-shell">
    <CmsSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="cms-shell__main">
      <CmsTopbar @menu="sidebarOpen = !sidebarOpen" />
      <main class="cms-content">
        <CmsBreadcrumb />
        <slot />
      </main>
    </div>
      <CmsConfirmDialog />
      <CmsToasts />
  </div>
</template>
