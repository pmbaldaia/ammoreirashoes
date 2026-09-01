export const usePublicContent = () => {
  const settings = useState<any>('public-company-settings', () => null)
  async function loadSettings() {
    if (!settings.value) {
      const rows = await $fetch<any[]>('/api/public/settings')
      settings.value = rows.find(row => row.id === 'company') || rows[0] || {}
    }
    return settings.value
  }
  return { settings, loadSettings }
}
