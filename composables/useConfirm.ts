export interface ConfirmDialogOptions {
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'warning'
}

export interface ConfirmDialogState {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  tone: 'danger' | 'warning'
}

let resolver: ((value: boolean) => void) | null = null

export const useConfirm = () => {
  const state = useState<ConfirmDialogState>('cms-confirm-dialog', () => ({
    open: false,
    title: 'Confirmar ação',
    message: '',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    tone: 'danger',
  }))

  const ask = (options: ConfirmDialogOptions = {}) =>
    new Promise<boolean>((resolve) => {
      if (resolver) resolver(false)
      resolver = resolve

      state.value = {
        open: true,
        title: options.title || 'Confirmar ação',
        message: options.message || 'Tens a certeza de que queres continuar?',
        confirmLabel: options.confirmLabel || 'Confirmar',
        cancelLabel: options.cancelLabel || 'Cancelar',
        tone: options.tone || 'danger',
      }
    })

  const settle = (value: boolean) => {
    state.value.open = false
    const current = resolver
    resolver = null
    current?.(value)
  }

  const confirm = () => settle(true)
  const cancel = () => settle(false)

  return { state, ask, confirm, cancel }
}
