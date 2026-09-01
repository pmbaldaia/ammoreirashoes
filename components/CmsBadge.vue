<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  tone?: 'success' | 'warning' | 'danger' | 'info'
}>(), { tone: 'info' })
</script>

<template>
  <span class="status-badge" :class="`status-badge--${tone}`">
    <span class="status-badge__dot" />{{ label }}
  </span>
</template>
