<script setup>
import {
  PhInstagramLogo,
  PhFacebookLogo,
  PhTiktokLogo,
} from "@phosphor-icons/vue";
const error = useError();
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-cover bg-center bg-no-repeat relative text-gray-900 dark:text-gray-100"
    :style="{ backgroundImage: 'url(/feira/feira-calcado.jpg)' }"
  >
    <div class="absolute inset-0 bg-black/60"></div>

    <div
      class="relative z-10 max-w-md w-full bg-white/90 dark:bg-black/70 backdrop-blur-md rounded-2xl p-8 shadow-lg flex flex-col items-center"
    >
      <div
        class="w-28 h-28 md:w-36 md:h-36 animate-bounce mb-6 text-black dark:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          fill="currentColor"
          width="100%"
          height="100%"
        >
          <path
            d="M231.16,166.63l-28.63-14.31A47.74,47.74,0,0,1,176,109.39V80a8,8,0,0,0-8-8,48.05,48.05,0,0,1-48-48,8,8,0,0,0-12.83-6.37L30.13,76l-.2.16a16,16,0,0,0-1.24,23.75L142.4,213.66a8,8,0,0,0,5.66,2.34H224a16,16,0,0,0,16-16V180.94A15.92,15.92,0,0,0,231.16,166.63ZM224,200H151.37L40,88.63l12.87-9.76,38.79,38.79A8,8,0,0,0,103,106.34L65.74,69.11l40-30.31A64.15,64.15,0,0,0,160,87.5v21.89a63.65,63.65,0,0,0,35.38,57.24L224,180.94ZM70.8,184H32a8,8,0,0,1,0-16H70.8a8,8,0,1,1,0,16Zm40,24a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16h54.8A8,8,0,0,1,110.8,208Z"
          />
        </svg>
      </div>

      <h1 class="text-6xl font-extrabold text-gray-800 dark:text-gray-200 mb-2">
        <span>{{ error?.statusCode ?? "404" }}</span>
      </h1>

      <p class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Página não encontrada!
      </p>

      <p class="text-gray-600 dark:text-gray-400 text-base mb-8 max-w-xs px-4">
        {{
          error?.statusMessage ??
          "Ups! Este corredor está vazio. Mas temos muito calçado à tua espera na página principal."
        }}
      </p>

      <NuxtLink
        to="/"
        class="w-full max-w-xs bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-full py-3 font-semibold transition"
      >
        Voltar à Página Inicial
      </NuxtLink>

      <p class="text-sm text-gray-600 dark:text-gray-400 mt-6 mb-2">
        Segue-nos nas redes sociais
      </p>

      <div
        class="flex justify-center items-center gap-8 text-gray-700 dark:text-gray-300"
      >
        <a
          href="https://www.instagram.com/a.mshoes"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-pink-600 transition"
        >
          <PhInstagramLogo class="w-8 h-8" />
        </a>
        <a
          href="https://www.facebook.com/amshoes"
          aria-label="Facebook"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-blue-600 transition"
        >
          <PhFacebookLogo class="w-8 h-8" />
        </a>
        <a
          href="https://www.tiktok.com/@a.mshoes"
          aria-label="TikTok"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-black dark:hover:text-white transition"
        >
          <PhTiktokLogo class="w-8 h-8" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
.animate-bounce {
  animation: bounce 2s infinite;
  display: block;
}
</style>
