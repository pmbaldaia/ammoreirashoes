<script setup lang="ts">
const route = useRoute()
await usePublicPage('eventos')
const { events } = usePublicSiteData()
const event = computed(() => events.value.find((item:any) => item.slug === route.params.slug))
if (!event.value) throw createError({ statusCode: 404, message: 'Feira ou evento não encontrado' })

useHead({
  title: event.value ? `${event.value.name} — AM Moreira` : 'Feiras & Eventos — AM Moreira',
  meta: [{ name:'description', content:event.value?.description || 'Feiras e eventos AM Moreira.' }],
})

function fairDaysLabel(item:any) {
  if (!Array.isArray(item?.fairDays) || !item.fairDays.length) return ''
  return item.fairDays.join(', ').replace(/, ([^,]*)$/, ' e $1')
}
</script>

<template>
  <div class="am-site">
    <CmsManagedHeader page-slug="eventos" />
    <PublicPageHeader
      kicker="Feiras & Eventos"
      :title="event?.name || 'Feira ou evento não encontrado'"
      :description="event?.description || 'O registo solicitado não está disponível.'"
    />
    <section v-if="event" class="am-section">
      <div class="am-wrap am-grid">
        <div class="am-card__body">
          <p v-if="fairDaysLabel(event)"><strong>Dias habituais:</strong> {{ fairDaysLabel(event) }}</p>
          <p v-if="event.periodicity"><strong>Periodicidade:</strong> {{ event.periodicity }}</p>
          <p v-if="event.startDate"><strong>Data:</strong> {{ event.startDate }}<span v-if="event.endDate"> — {{ event.endDate }}</span></p>
          <p v-if="event.venue || event.city"><strong>Local:</strong> {{ [event.venue,event.city,event.country].filter(Boolean).join(' · ') }}</p>
          <p v-if="event.municipality"><strong>Concelho:</strong> {{ event.municipality }}</p>
          <p v-if="event.stand"><strong>Stand:</strong> {{ event.stand }}</p>
          <p v-if="event.edition"><strong>Edição:</strong> {{ event.edition }}</p>
          <div v-if="Array.isArray(event.calendar2026) && event.calendar2026.length" style="margin-top:24px">
            <h2 style="font-size:1.35rem">Calendário de {{ event.calendarYear || 2026 }}</h2>
            <ul><li v-for="row in event.calendar2026" :key="row">{{ row }}</li></ul>
          </div>
          <a v-if="event.website" class="am-btn" :href="event.website" target="_blank" rel="noopener noreferrer" style="margin-top:24px">Website do evento</a>
        </div>
        <div v-if="event.image" class="am-card__image"><img :src="event.image" :alt="event.name"></div>
      </div>
    </section>
  </div>
</template>
