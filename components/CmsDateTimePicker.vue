<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string | null
  type: 'date' | 'time' | 'datetime-local'
  required?: boolean
  readonly?: boolean
  placeholder?: string
}>(), {
  modelValue: '',
  required: false,
  readonly: false,
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const icon = computed(() => ({
  date: 'lucide:calendar-days',
  time: 'lucide:clock-3',
  'datetime-local': 'lucide:calendar-clock',
}[props.type]))

const quickLabel = computed(() => props.type === 'date' ? 'Hoje' : 'Agora')

function openPicker() {
  if (props.readonly) return
  const input = inputRef.value
  if (!input) return
  try {
    if (typeof input.showPicker === 'function') input.showPicker()
    else input.focus()
  } catch {
    input.focus()
  }
}

function toLocalDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function setQuickValue() {
  if (props.readonly) return
  const now = new Date()
  if (props.type === 'date') {
    const pad = (value: number) => String(value).padStart(2, '0')
    emit('update:modelValue', `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`)
  }
  else if (props.type === 'time') emit('update:modelValue', now.toTimeString().slice(0, 5))
  else emit('update:modelValue', toLocalDateTime(now))
}

function clear() {
  if (!props.readonly) emit('update:modelValue', '')
}
</script>

<template>
  <div class="cms-date-picker" :class="{ 'is-readonly': readonly }">
    <div class="cms-date-picker__control">
      <Icon :name="icon" size="18" class="cms-date-picker__leading-icon" />
      <input
        ref="inputRef"
        :value="modelValue || ''"
        :type="type"
        :required="required"
        :readonly="readonly"
        :placeholder="placeholder"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @click="openPicker"
      >
      <button
        v-if="!readonly"
        type="button"
        class="cms-date-picker__open"
        :aria-label="type === 'time' ? 'Abrir seletor de hora' : 'Abrir seletor de data'"
        @click.stop="openPicker"
      >
        <Icon name="lucide:chevron-down" size="16" />
      </button>
    </div>

    <div v-if="!readonly" class="cms-date-picker__quick-actions">
      <button type="button" @click.stop="setQuickValue">
        <Icon :name="type === 'date' ? 'lucide:calendar-check' : 'lucide:clock'" size="14" />
        {{ quickLabel }}
      </button>
      <button v-if="modelValue" type="button" @click.stop="clear">
        <Icon name="lucide:x" size="14" />
        Limpar
      </button>
    </div>
  </div>
</template>
