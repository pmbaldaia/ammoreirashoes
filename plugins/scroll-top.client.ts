import { nextTick } from 'vue'

export default defineNuxtPlugin(() => {
  const router = useRouter()

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }

  router.afterEach(async (to, from) => {
    if (to.path === from.path) return

    await nextTick()

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (to.hash) {
          const target = document.querySelector(to.hash)
          if (target instanceof HTMLElement) {
            target.scrollIntoView({
              behavior: 'auto',
              block: 'start',
            })
            return
          }
        }

        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      })
    })
  })
})
