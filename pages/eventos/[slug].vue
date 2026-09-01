<script setup lang="ts">
definePageMeta({ layout: 'default' })
await usePublicPage('eventos')
const route = useRoute()
const { data: events } = await useFetch('/api/public/events', { default: () => [] })
const event = computed(() => events.value.find((item:any) => item.slug === route.params.slug))
if (!event.value) throw createError({ statusCode: 404, message: 'Evento não encontrado' })
useHead(() => ({
  title: event.value ? `${event.value.name} — AM Moreira` : 'Evento — AM Moreira',
  meta: [{ name:'description', content:event.value?.description || 'Feiras e eventos AM Moreira.' }],
}))
</script>

<template>
  <div class="am-site">
    <PublicPageHeader
      kicker="Feiras & Eventos"
      :title="event?.name || 'Evento não encontrado'"
      :description="event?.description || 'O evento solicitado não está disponível.'"
    />
    <section v-if="event" class="am-section">
      <div class="am-wrap am-split">
        <div>
          <p v-if="event.startDate"><strong>Data:</strong> {{ event.startDate }}<span v-if="event.endDate"> — {{ event.endDate }}</span></p>
          <p v-if="event.venue || event.city"><strong>Local:</strong> {{ [event.venue,event.city,event.country].filter(Boolean).join(' · ') }}</p>
          <p v-if="event.stand"><strong>Stand:</strong> {{ event.stand }}</p>
          <p v-if="event.edition"><strong>Edição:</strong> {{ event.edition }}</p>
          <a v-if="event.website" class="am-btn" :href="event.website" target="_blank" rel="noopener noreferrer" style="margin-top:24px">Website do evento</a>
        </div>
        <div v-if="event.image" class="am-card__image"><img :src="event.image" :alt="event.name"></div>
      </div>
    </section>
  </div>
</template>
