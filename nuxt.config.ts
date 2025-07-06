export default defineNuxtConfig({
  modules: ["@nuxtjs/color-mode", "nuxt-icon", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@phosphor-icons/vue"],
    },
    ssr: {
      noExternal: ["@phosphor-icons/vue"],
    },
  },
  colorMode: {
    classSuffix: "",
    preference: "system",
  },
  app: {
    head: {
      title: "AMShoes",
      link: [{ rel: "icon", type: "image/png", href: "/favicon.ico" }],
      meta: [
        { name: "description", content: "Site oficial AMShoes" },
        { property: "og:title", content: "AMShoes" },
        {
          property: "og:description",
          content: "Site oficial AMShoes",
        },
        { property: "og:image", content: "/favicon.ico" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "" },
      ],
    },
  },
});
