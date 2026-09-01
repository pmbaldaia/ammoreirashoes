<script setup lang="ts">
import { mediaService, type MediaItem } from '~/modules/media/service/media.service'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  recommended?: string
}>(), {
  modelValue: '',
  label: 'Imagem',
  recommended: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const toast = useToast()
const media = mediaService()

const libraryOpen = ref(false)
const library = ref<MediaItem[]>([])
const libraryPending = ref(false)
const uploading = ref(false)
const search = ref('')

const imageLibrary = computed(() => {
  const q = search.value.trim().toLowerCase()
  return library.value.filter(item => {
    if (item.name.toLowerCase().endsWith('.pdf')) return false
    if (!q) return true
    return item.name.toLowerCase().includes(q)
  })
})

async function uploadFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !file.type.startsWith('image/')) return

  uploading.value = true
  try {
    const result = await media.upload(file)
    emit('update:modelValue', result.url)
    toast.success('Imagem carregada', `${props.label} está pronta para guardar.`)
  } catch (error: any) {
    toast.error(
      'Erro no upload',
      error?.data?.message || error?.message || 'Não foi possível carregar a imagem.'
    )
  } finally {
    uploading.value = false
  }
}

async function openLibrary() {
  libraryOpen.value = true
  search.value = ''
  libraryPending.value = true
  try {
    library.value = await media.list()
  } catch (error: any) {
    toast.error(
      'Erro ao carregar a Multimédia',
      error?.data?.message || error?.message || 'Não foi possível consultar os ficheiros.'
    )
  } finally {
    libraryPending.value = false
  }
}

function selectImage(url: string) {
  emit('update:modelValue', url)
  libraryOpen.value = false
  toast.success('Imagem selecionada', `${props.label} está pronta para guardar.`)
}

function clearImage() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="single-image-picker">
    <div class="single-image-picker__head">
      <div>
        <strong>{{ label }}</strong>
        <small v-if="recommended">{{ recommended }}</small>
      </div>

      <button
        v-if="modelValue"
        type="button"
        class="text-button single-image-picker__clear"
        @click="clearImage"
      >
        <Icon name="lucide:x" size="15" />
        Remover
      </button>
    </div>

    <div class="single-image-picker__preview">
      <img v-if="modelValue" :src="modelValue" :alt="`Pré-visualização: ${label}`">
      <div v-else class="single-image-picker__empty">
        <Icon name="lucide:image" size="28" />
        <span>Sem imagem selecionada</span>
      </div>
    </div>

    <div class="single-image-picker__actions">
      <label class="btn btn--primary" :class="{ 'is-disabled': uploading }">
        <Icon :name="uploading ? 'lucide:loader-circle' : 'lucide:upload'" />
        {{ uploading ? 'A carregar…' : 'Carregar imagem' }}
        <input
          type="file"
          accept="image/*"
          hidden
          :disabled="uploading"
          @change="uploadFile"
        >
      </label>

      <button type="button" class="btn btn--secondary" @click="openLibrary">
        <Icon name="lucide:images" />
        Multimédia
      </button>
    </div>

    <Teleport to="body">
      <div v-if="libraryOpen" class="modal-backdrop gallery-library-backdrop" @click.self="libraryOpen = false">
        <section class="cms-modal gallery-library-modal">
          <header>
            <div>
              <p class="eyebrow">Multimédia</p>
              <h2>Escolher {{ label.toLowerCase() }}</h2>
              <p>Seleciona uma imagem já existente na biblioteca.</p>
            </div>
            <button type="button" class="icon-button" aria-label="Fechar" @click="libraryOpen = false">
              <Icon name="lucide:x" />
            </button>
          </header>

          <label class="resource-search gallery-library-search">
            <Icon name="lucide:search" />
            <input v-model="search" type="search" placeholder="Pesquisar imagens…">
          </label>

          <div v-if="libraryPending" class="cms-loading">A carregar Multimédia…</div>

          <div v-else-if="!imageLibrary.length" class="empty-state">
            <Icon name="lucide:image-off" size="30" />
            <h3>Sem imagens disponíveis</h3>
            <p>Carrega primeiro uma imagem na Multimédia.</p>
          </div>

          <div v-else class="gallery-library-grid">
            <button
              v-for="item in imageLibrary"
              :key="item.id"
              type="button"
              class="gallery-library-item"
              :class="{ 'is-selected': item.url === modelValue }"
              @click="selectImage(item.url)"
            >
              <img :src="item.url" :alt="item.name">
              <span class="gallery-library-item__check">
                <Icon :name="item.url === modelValue ? 'lucide:check-circle-2' : 'lucide:circle'" size="17" />
              </span>
              <span class="gallery-library-item__name">{{ item.name }}</span>
              <small v-if="item.url === modelValue">Atual</small>
            </button>
          </div>

          <footer>
            <button type="button" class="btn btn--secondary" @click="libraryOpen = false">
              Fechar
            </button>
          </footer>
        </section>
      </div>
    </Teleport>
  </div>
</template>
