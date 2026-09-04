<script setup lang="ts">
await usePublicPage('eventos')
const { events: items } = usePublicSiteData()

function daysLabel(item: any) {
  if (Array.isArray(item.fairDays) && item.fairDays.length) return `Dias ${item.fairDays.join(', ').replace(/, ([^,]*)$/, ' e $1')}`
  if (item.startDate) return item.endDate ? `${item.startDate} — ${item.endDate}` : item.startDate
  return ''
}
</script>

<template>
  <div class="am-site">
    <CmsManagedHeader page-slug="eventos" />
    <section class="am-section">
      <div class="am-wrap">
        <div v-if="items.length" class="am-grid">
          <article v-for="item in items" :key="item.id" class="am-card">
            <div v-if="item.image" class="am-card__image"><img :src="item.image" :alt="item.name" loading="lazy"></div>
            <div class="am-card__body">
              <p class="am-kicker">{{ [item.city, item.country].filter(Boolean).join(' · ') }}</p>
              <h2 style="font-size:1.5rem"><NuxtLink :to="`/eventos/${item.slug}`">{{ item.name }}</NuxtLink></h2>
              <p v-if="daysLabel(item)"><strong>Dias:</strong> {{ daysLabel(item).replace(/^Dias /, '') }}</p>
              <p v-if="item.periodicity"><strong>Periodicidade:</strong> {{ item.periodicity }}</p>
              <p v-if="item.municipality"><strong>Concelho:</strong> {{ item.municipality }}</p>
              <p>{{ item.description }}</p>
            </div>
          </article>
        </div>
        <div v-else class="empty-state"><h2>Sem feiras ou eventos disponíveis</h2><p>Quando existirem novos registos publicados, serão apresentados aqui.</p></div>
      </div>
    </section>
  </div>
</template>
