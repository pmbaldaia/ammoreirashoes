<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { applyImageFallback } from '~/utils/imageFallback'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  src?: string | null
  alt?: string
  preset?: string
  fallback?: string
}>(), {
  src: '',
  alt: '',
})

const nativeImgRef = ref<HTMLImageElement | null>(null)
const nuxtImgRef = ref<ComponentPublicInstance | null>(null)

// Logos de equipas e uploads do CMS são servidos diretamente, como no Admin.
// Evita `/_ipx`/`/.netlify/images` que falham com ficheiros estáticos e GridFS.
const useDirectImage = computed(() => {
  const value = String(props.src || '')
  return (
    value.startsWith('/uploads/') ||
    value.includes('/uploads/') ||
    value.startsWith('/logos/')
  )
})

function resolveImageElement(event: Event) {
  if (event.target instanceof HTMLImageElement) {
    return event.target
  }

  const element = useDirectImage.value
    ? nativeImgRef.value
    : nuxtImgRef.value?.$el

  return element instanceof HTMLImageElement ? element : null
}

function onImageError(event: Event) {
  applyImageFallback(event, props.fallback, resolveImageElement(event))
}
</script>

<template>
  <img
    v-if="useDirectImage"
    ref="nativeImgRef"
    :src="src || ''"
    :alt="alt"
    v-bind="$attrs"
    @error="onImageError"
  >
  <NuxtImg
    v-else
    ref="nuxtImgRef"
    :src="src || ''"
    :alt="alt"
    :preset="preset"
    v-bind="$attrs"
    @error="onImageError"
  />
</template>
