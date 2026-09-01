<script setup lang="ts">
const { state, confirm, cancel } = useConfirm()

const icon = computed(() =>
  state.value.tone === 'danger'
    ? 'lucide:trash-2'
    : 'lucide:triangle-alert'
)

function onKeydown(event: KeyboardEvent) {
  if (!state.value.open) return
  if (event.key === 'Escape') cancel()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="cms-confirm">
      <div
        v-if="state.open"
        class="cms-confirm-backdrop"
        role="presentation"
        @click.self="cancel"
      >
        <section
          class="cms-confirm-dialog"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="'cms-confirm-title'"
          :aria-describedby="'cms-confirm-description'"
        >
          <div
            class="cms-confirm-dialog__icon"
            :class="`cms-confirm-dialog__icon--${state.tone}`"
          >
            <Icon :name="icon" size="25" />
          </div>

          <div class="cms-confirm-dialog__copy">
            <p class="eyebrow">Confirmação necessária</p>
            <h2 id="cms-confirm-title">{{ state.title }}</h2>
            <p id="cms-confirm-description">{{ state.message }}</p>
          </div>

          <div class="cms-confirm-dialog__actions">
            <button
              type="button"
              class="btn btn--secondary"
              @click="cancel"
            >
              {{ state.cancelLabel }}
            </button>

            <button
              type="button"
              class="btn cms-confirm-dialog__confirm"
              :class="`cms-confirm-dialog__confirm--${state.tone}`"
              autofocus
              @click="confirm"
            >
              <Icon :name="icon" />
              {{ state.confirmLabel }}
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
