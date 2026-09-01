<script setup lang="ts">
defineProps<{ open?: boolean }>();
defineEmits<{ close: [] }>();
const route = useRoute();
const { groups } = useCmsNavigation();
const { isDark } = useThemeMode();
</script>
<template>
  <button
    v-if="open"
    class="sidebar-backdrop"
    type="button"
    aria-label="Fechar menu"
    @click="$emit('close')"
  />
  <aside class="cms-sidebar" :class="{ 'cms-sidebar--open': open }">
    <NuxtLink to="/admin" class="brand" @click="$emit('close')"
      ><img
        :src="isDark ? '/brand/logo-branco.png' : '/brand/logo-preto.png'"
        alt="AM Moreira"
        class="brand-logo-original brand__logo"
      /></NuxtLink
    >
    <nav class="sidebar-nav" aria-label="Navegação principal">
      <section v-for="group in groups" :key="group.label" class="nav-group">
        <p class="nav-group__title">{{ group.label }}</p>
        <NuxtLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ 'nav-item--active': route.path === item.to }"
          @click="$emit('close')"
          ><Icon :name="item.icon" size="18" /><span class="nav-item__label">{{
            item.label
          }}</span></NuxtLink
        >
      </section>
    </nav>
    <div class="sidebar-footer">
      <div class="workspace-pill">
        <span class="workspace-pill__avatar">AM</span>
        <div class="workspace-pill__copy">
          <strong>AM Moreira</strong><span>Produção</span>
        </div>
      </div>
    </div>
  </aside>
</template>
