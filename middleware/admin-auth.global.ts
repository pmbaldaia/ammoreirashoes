export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return
  const { token, me } = useAuth()
  if (['/admin/login', '/admin/recuperar-password', '/admin/redefinir-password'].includes(to.path)) {
    if (token.value) { try { await me(); return navigateTo('/admin') } catch { token.value = null } }
    return
  }
  if (!token.value) return navigateTo('/admin/login')
  try {
    const user = await me()
    if (to.path.startsWith('/admin/utilizadores') && user.role !== 'admin') {
      return navigateTo('/admin')
    }
  } catch {
    token.value = null
    return navigateTo('/admin/login')
  }
})
