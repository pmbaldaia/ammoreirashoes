import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 96,
        behavior: 'smooth',
      }
    }

    if (to.path !== from.path) {
      return {
        left: 0,
        top: 0,
        behavior: 'auto',
      }
    }

    return false
  },
}
