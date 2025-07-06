export default defineNuxtRouteMiddleware((to) => {
  const blockedPaths = [
    "/admin",
    "/auth/login",
    "/auth/register",
    "/manutencao",
  ];

  if (blockedPaths.includes(to.path)) {
    return navigateTo("/error");
  }

  const auth = useAuthStore();
  /* 
  if (to.path.startsWith("/admin") && !auth.isAdmin) {
    return navigateTo("/auth/login");
  }
 */
});
