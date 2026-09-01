<script setup lang="ts">
const props = withDefaults(defineProps<{
  page: number
  totalItems: number
  pageSize?: number
}>(), {
  pageSize: 10,
})

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / props.pageSize)))
const currentPage = computed(() => Math.min(Math.max(1, props.page), totalPages.value))
const start = computed(() => props.totalItems ? (currentPage.value - 1) * props.pageSize + 1 : 0)
const end = computed(() => Math.min(currentPage.value * props.pageSize, props.totalItems))

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = new Set([1, total, current - 1, current, current + 1])
  return [...pages].filter(page => page >= 1 && page <= total).sort((a, b) => a - b)
})

function go(page: number) {
  const next = Math.min(Math.max(1, page), totalPages.value)
  if (next !== currentPage.value) emit('update:page', next)
}
</script>

<template>
  <nav
    v-if="totalItems > pageSize"
    class="cms-pagination"
    aria-label="Paginação"
  >
    <p class="cms-pagination__summary">
      {{ start }}–{{ end }} de {{ totalItems }}
    </p>

    <div class="cms-pagination__controls">
      <button
        type="button"
        class="cms-pagination__button"
        :disabled="currentPage === 1"
        aria-label="Página anterior"
        @click="go(currentPage - 1)"
      >
        <Icon name="lucide:chevron-left" size="16" />
      </button>

      <template v-for="(pageNumber, index) in visiblePages" :key="pageNumber">
        <span
          v-if="index > 0 && pageNumber - visiblePages[index - 1] > 1"
          class="cms-pagination__ellipsis"
        >
          …
        </span>

        <button
          type="button"
          class="cms-pagination__button"
          :class="{ 'is-active': pageNumber === currentPage }"
          :aria-current="pageNumber === currentPage ? 'page' : undefined"
          @click="go(pageNumber)"
        >
          {{ pageNumber }}
        </button>
      </template>

      <button
        type="button"
        class="cms-pagination__button"
        :disabled="currentPage === totalPages"
        aria-label="Página seguinte"
        @click="go(currentPage + 1)"
      >
        <Icon name="lucide:chevron-right" size="16" />
      </button>
    </div>
  </nav>
</template>
