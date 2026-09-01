<script setup lang="ts">
definePageMeta({ layout: 'admin-auth' })
const route = useRoute()
await navigateTo({ path: '/admin/recuperar-password', query: route.query }, { replace: true })
</script>
<template><section class="auth-card"><p>A redirecionar…</p></section></template>
