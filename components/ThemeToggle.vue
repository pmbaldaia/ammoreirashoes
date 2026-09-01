<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: true })
const { isDark, toggle } = useThemeMode()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :class="{ 'theme-toggle--compact': compact }"
    :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
    :title="isDark ? 'Modo claro' : 'Modo escuro'"
    @click="toggle"
  >
    <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" size="18" />
    <span v-if="!compact">{{ isDark ? 'Modo claro' : 'Modo escuro' }}</span>
  </button>
</template>
