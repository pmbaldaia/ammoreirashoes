import fs from "fs";
import path from "path";

function getAllImages(
  dir: string,
  publicPath: string,
  baseUrl: string,
  relativePath = "",
) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let images: { loc: string }[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    const fileRelativePath = path
      .join(relativePath, file.name)
      .replace(/\\/g, "/");

    if (file.isDirectory()) {
      images = images.concat(
        getAllImages(fullPath, publicPath, baseUrl, fileRelativePath),
      );
    } else if (/\.(jpe?g|png|webp|gif|avif)$/i.test(file.name)) {
      images.push({
        loc: `${baseUrl}/${fileRelativePath}`,
      });
    }
  }

  return images;
}

function getAllRoutes(dir: string, prefix = ""): string[] {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let routes: string[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      routes = routes.concat(getAllRoutes(fullPath, `${prefix}/${file.name}`));
    } else if (file.name.endsWith(".vue")) {
      const name = file.name.replace(/\.vue$/, "");
      if (name === "index") {
        routes.push(prefix || "/");
      } else {
        routes.push(`${prefix}/${name}`);
      }
    }
  }

  return routes;
}

const isProd = process.env.NODE_ENV === "production";
const siteUrl = process.env.NUXT_SITE_URL || "http://localhost:3000";

export default defineNuxtConfig({
  compatibilityDate: "2026-05-23",

  nitro: {
    preset: "netlify",
  },

  modules: [
    "nuxt-icon",
    "@pinia/nuxt",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@nuxt/image",
  ],

  image: {
    domains: [process.env.NUXT_API_MEDIA_HOST || "localhost"],
    format: ["webp"],
    quality: 100,
    densities: [1],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      hero: {
        modifiers: { width: 700, fit: "inside", format: "webp", quality: 82 },
      },
      card: {
        modifiers: {
          width: 480,
          height: 480,
          fit: "cover",
          format: "webp",
          quality: 80,
        },
      },
      cardLg: {
        modifiers: {
          width: 800,
          height: 800,
          fit: "cover",
          format: "webp",
          quality: 82,
        },
      },
      avatar: {
        modifiers: {
          width: 320,
          height: 400,
          fit: "inside",
          format: "webp",
          quality: 80,
        },
      },
      portrait: {
        modifiers: {
          width: 400,
          height: 384,
          fit: "cover",
          format: "webp",
          quality: 80,
        },
      },
      thumb: {
        modifiers: {
          width: 400,
          height: 192,
          fit: "cover",
          format: "webp",
          quality: 75,
        },
      },
      logo: {
        modifiers: {
          width: 160,
          height: 120,
          fit: "inside",
          format: "webp",
          quality: 78,
        },
      },
      badge: {
        modifiers: {
          width: 80,
          height: 80,
          fit: "inside",
          format: "webp",
          quality: 80,
        },
      },
      sponsor: {
        modifiers: {
          width: 160,
          height: 120,
          fit: "inside",
          format: "webp",
          quality: 75,
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      siteUrl,
      apiBase: "",
      cmsUrl: "/admin",
      sitemap: {
        hostname: siteUrl,
        exclude: ["/admin/**", "/auth/**", "/manutencao"],
      },
      robots: {
        rules: [
          {
            userAgent: "*",
            disallow: [
              "/_nuxt/",
              "/admin/**",
              "/auth/**",
              "/manutencao",
              "/sitemap.xml",
            ],
          },
          {
            userAgent: "*",
            allow: "/",
          },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: "pt-PT" },
      title: "AM Moreira",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: siteUrl },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@500;600&family=Poppins:wght@400;500;600;700&display=swap",
        },
      ],
      meta: [
        { name: "description", content: "AM Moreira — moda, conforto e qualidade." },
        {
          name: "keywords",
          content: "AM Moreira, AM Shoes, calçado, botas, malas, marroquinaria",
        },
        { name: "robots", content: "index, follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { property: "og:title", content: "AM Moreira" },
        {
          property: "og:description",
          content: "Moda, conforto e qualidade.",
        },
        { property: "og:image", content: `${siteUrl}/favicon.ico` },
        { property: "og:type", content: "website" },
        { property: "og:url", content: siteUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "AM Moreira" },
        {
          name: "twitter:description",
          content: "Moda, conforto e qualidade.",
        },
        { name: "twitter:image", content: `${siteUrl}/favicon.ico` },
      ],
    },
  },

  sitemap: {
    hostname: siteUrl,
    exclude: ["/admin/**", "/auth/**", "/manutencao"],
    urls: async () => {
      const pagesDir = path.join(process.cwd(), "pages");
      const routes = getAllRoutes(pagesDir);

      const publicPath = path.join(process.cwd(), "public");
      const images = getAllImages(publicPath, siteUrl);

      const urls = routes.map((route) => ({
        loc: `${siteUrl}${route}`,
        lastmod: new Date().toISOString(),
      }));

      // Adicionar homepage com imagens
      urls.push({
        loc: siteUrl,
        images,
        lastmod: new Date().toISOString(),
      });

      return urls;
    },
  },

  css: ["~/assets/css/tokens.css", "~/assets/css/main.css", "~/assets/css/am-moreira.css", "~/assets/css/ui-polish.css"],

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
      // Evita pre-bundle do composable manifest (erro #app-manifest no dev)
      exclude: ["nuxt"],
    },
    ssr: { noExternal: ["@phosphor-icons/vue"] },
  },
});
