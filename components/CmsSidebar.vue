<script setup lang="ts">
defineProps<{ open?: boolean }>();
defineEmits<{ close: [] }>();
const route = useRoute();
const { groups } = useCmsNavigation();
const { isDark } = useThemeMode();
const { authHeaders } = useAuth();
const newContacts = ref(0);
let contactsTimer: ReturnType<typeof setInterval> | undefined;

const badgeFor = (to: string) => to === '/admin/contactos' && newContacts.value > 0 ? newContacts.value : null;
async function refreshNewContacts() {
  try {
    const contacts = await $fetch<any[]>('/api/contacts', { headers: authHeaders() });
    newContacts.value = contacts.filter((contact) => contact.status === 'new').length;
  } catch {
    // A badge must never block the CMS navigation when the request fails.
  }
}
onMounted(() => {
  refreshNewContacts();
  contactsTimer = setInterval(refreshNewContacts, 5_000);
});
onBeforeUnmount(() => contactsTimer && clearInterval(contactsTimer));
watch(() => route.fullPath, refreshNewContacts);
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
          }}</span><span v-if="badgeFor(item.to)" class="nav-item__badge" :aria-label="`${badgeFor(item.to)} contactos novos`">{{ badgeFor(item.to) }}</span></NuxtLink
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
