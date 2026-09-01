export default defineNuxtRouteMiddleware((to) => {
  // Middleware legado do site público.
  // A proteção de /admin é tratada exclusivamente por admin-auth.global.ts.
  const blockedPaths = ["/auth/login", "/auth/register", "/manutencao"];

  if (blockedPaths.includes(to.path)) {
    return navigateTo("/error");
  }
});
