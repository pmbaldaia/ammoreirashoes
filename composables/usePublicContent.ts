export const usePublicContent = () => {
  const { settings: settingsRows, load } = usePublicSiteData()
  const settings = computed<any>(() => settingsRows.value.find((row: any) => row.id === 'company') || settingsRows.value[0] || {})

  async function loadSettings() {
    await load()
    return settings.value
  }

  return { settings, loadSettings }
}
