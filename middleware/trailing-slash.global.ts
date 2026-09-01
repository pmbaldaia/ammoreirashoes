export default defineNuxtRouteMiddleware((to) => {
  // Só corre em produção — em dev deixa o Nuxt tratar as rotas normalmente
  if (process.env.NODE_ENV !== "production") return;

  // Só remove trailing slash se não for a homepage e terminar em "/"
  if (to.path !== "/" && to.path.endsWith("/")) {
    const newPath = to.path.slice(0, -1);
    return navigateTo(
      { path: newPath, query: to.query, hash: to.hash },
      { redirectCode: 301 }
    );
  }
});