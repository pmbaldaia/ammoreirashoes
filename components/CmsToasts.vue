<script setup lang="ts">
const { toasts, remove } = useToast()

const iconFor = (type: string) => ({
  success: 'lucide:circle-check',
  error: 'lucide:circle-alert',
  warning: 'lucide:triangle-alert',
  info: 'lucide:info',
}[type] || 'lucide:info')
</script>

<template>
  <Teleport to="body">
    <div class="cms-toast-viewport" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="cms-toast">
        <article
          v-for="toast in toasts"
          :key="toast.id"
          class="cms-toast"
          :class="[`cms-toast--${toast.type}`, { 'is-leaving': toast.leaving }]"
          role="status"
        >
          <div class="cms-toast__icon">
            <Icon :name="iconFor(toast.type)" size="20" />
          </div>

          <div class="cms-toast__content">
            <strong>{{ toast.title }}</strong>
            <p v-if="toast.message">{{ toast.message }}</p>
          </div>

          <button
            type="button"
            class="cms-toast__close"
            aria-label="Fechar notificação"
            @click="remove(toast.id)"
          >
            <Icon name="lucide:x" size="17" />
          </button>

          <span
            v-if="toast.duration > 0"
            class="cms-toast__progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          />
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
