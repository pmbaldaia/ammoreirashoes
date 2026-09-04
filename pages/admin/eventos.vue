<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const service = useResourceService('events')
const fields = [
  { key: 'name', label: 'Nome' },
  { key: 'slug', label: 'Endereço da feira ou evento' },
  { key: 'image', label: 'Imagem ou logótipo', type: 'image', required: false },
  { key: 'description', label: 'Descrição', type: 'textarea', required: false },
  { key: 'location', label: 'Morada ou localização', required: false },
  { key: 'city', label: 'Localidade', tableLabel: 'Local', required: false },
  { key: 'municipality', label: 'Concelho', required: false },
  { key: 'country', label: 'País', required: false, defaultValue: 'Portugal' },
  { key: 'venue', label: 'Local / recinto', required: false },
  { key: 'fairDays', label: 'Dias da feira', tableLabel: 'Data', type: 'array', required: false, hint: 'Um dia por linha. Ex.: 9 e 25 em duas linhas.' },
  { key: 'periodicity', label: 'Periodicidade', required: false, placeholder: 'Ex.: 2 vezes por mês' },
  { key: 'calendarYear', label: 'Ano do calendário especial', type: 'number', required: false },
  { key: 'calendar2026', label: 'Datas específicas de 2026', type: 'array', required: false, hint: 'Uma linha por mês. Ex.: Janeiro: 9 e 26' },
  { key: 'startDate', label: 'Data de início', type: 'date', required: false },
  { key: 'endDate', label: 'Data de fim', type: 'date', required: false },
  { key: 'website', label: 'Site oficial', required: false },
  { key: 'stand', label: 'Stand', required: false },
  { key: 'edition', label: 'Edição ou ano', required: false },
  { key: 'featured', label: 'Destaque', type: 'select', options: [{ value: true, label: 'Sim' }, { value: false, label: 'Não' }], defaultValue: false },
  { key: 'order', label: 'Ordem', type: 'number', defaultValue: 1 },
  { key: 'status', label: 'Estado', type: 'select', filterable: true, options: [
    { value: 'draft', label: 'Rascunho' },
    { value: 'published', label: 'Publicado' },
    { value: 'archived', label: 'Arquivado' },
  ], defaultValue: 'draft' },
]
</script>

<template>
  <CmsResourceManager
    :service="service"
    title="Feiras e eventos"
    description="Gere as feiras e eventos apresentados no site, incluindo locais, datas e estado de publicação."
    :fields="fields"
    :columns="['name', 'city', 'fairDays', 'status']"
  />
</template>
