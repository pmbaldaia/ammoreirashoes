export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface CmsToast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration: number
  leaving?: boolean
}

interface ToastInput {
  type?: ToastType
  title: string
  message?: string
  duration?: number
}

const toastTimers = new Map<string, ReturnType<typeof setTimeout>>()

export const useToast = () => {
  const toasts = useState<CmsToast[]>('cms-toasts', () => [])

  const remove = (id: string) => {
    const toast = toasts.value.find(item => item.id === id)
    if (!toast) return
    toast.leaving = true

    const timer = toastTimers.get(id)
    if (timer) clearTimeout(timer)

    setTimeout(() => {
      toasts.value = toasts.value.filter(item => item.id !== id)
      toastTimers.delete(id)
    }, 220)
  }

  const show = ({ type = 'info', title, message = '', duration = 3600 }: ToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    toasts.value.push({ id, type, title, message, duration })

    if (duration > 0 && import.meta.client) {
      toastTimers.set(id, setTimeout(() => remove(id), duration))
    }

    return id
  }

  const success = (title: string, message?: string, duration?: number) =>
    show({ type: 'success', title, message, duration })

  const error = (title: string, message?: string, duration = 5200) =>
    show({ type: 'error', title, message, duration })

  const warning = (title: string, message?: string, duration?: number) =>
    show({ type: 'warning', title, message, duration })

  const info = (title: string, message?: string, duration?: number) =>
    show({ type: 'info', title, message, duration })

  return { toasts, show, success, error, warning, info, remove }
}
