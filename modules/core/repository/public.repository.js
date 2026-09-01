export function createPublicRepository(resource) {
  return {
    async list() {
      const config = useRuntimeConfig()
      return await $fetch(`${config.public.apiBase}/api/public/${resource}`)
    },
  }
}
