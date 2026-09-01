export type ThemeMode = 'light' | 'dark'

export const useThemeMode = () => {
  const cookie = useCookie<ThemeMode>('am_moreira_theme', {
    default: () => 'light',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  const mode = useState<ThemeMode>('am-moreira-theme-mode', () =>
    cookie.value === 'dark' ? 'dark' : 'light'
  )

  const isDark = computed(() => mode.value === 'dark')

  const apply = () => {
    cookie.value = mode.value
    if (!import.meta.client) return
    document.documentElement.classList.toggle('dark', isDark.value)
    document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
  }

  const setMode = (value: ThemeMode) => {
    mode.value = value
  }

  const toggle = () => {
    mode.value = isDark.value ? 'light' : 'dark'
  }

  useHead(() => ({
    htmlAttrs: {
      class: isDark.value ? 'dark' : '',
      style: `color-scheme:${isDark.value ? 'dark' : 'light'}`,
    },
  }))

  onMounted(apply)
  watch(mode, apply, { immediate: false })

  return { mode, isDark, setMode, toggle }
}
