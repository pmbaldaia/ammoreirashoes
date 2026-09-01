<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  value: string | number
  detail: string
  icon: string
  tone?: 'primary' | 'success' | 'warning' | 'info'
}>(), { tone: 'primary' })
</script>

<template>
  <article class="stat-card" :class="`stat-card--${tone}`">
    <div class="stat-card__head">
      <span class="stat-card__label">{{ label }}</span>
      <span class="stat-card__icon"><Icon :name="icon" size="18" /></span>
    </div>
    <strong class="stat-card__value">{{ value }}</strong>
    <p class="stat-card__detail">{{ detail }}</p>
  </article>
</template>
