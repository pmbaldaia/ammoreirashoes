<script setup>
import {
  PhInstagramLogo,
  PhFacebookLogo,
  PhTiktokLogo,
  PhPhone,
} from "@phosphor-icons/vue";
</script>

<template>
  <footer
    class="w-full mt-12 mb-2 rounded-lg py-8 text-gray-900 dark:text-white px-4 sm:px-6 md:px-8"
  >
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
      <hr
        class="border-t-2 border-gray-300 dark:border-gray-700 my-6 w-full mx-auto"
      />

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-8">
        <div class="flex flex-col h-full justify-start text-left">
          <a href="/" class="text-lg">
            <img
              v-if="isMounted && colorMode.value !== 'dark'"
              class="transition-transform transform hover:scale-125 w-24 h-24 lg:w-20 lg:h-20"
              src="/assets/img/LogoPreto.png"
              alt="Logo AMSHOES"
              loading="eager"
            />
            <img
              v-else-if="isMounted && colorMode.value === 'dark'"
              class="transition-transform transform hover:scale-125 w-24 h-24 lg:w-20 lg:h-20"
              src="/assets/img/LogoBranco.png"
              alt="Logo AMSHOES"
              loading="eager"
            />
          </a>
        </div>

        <div class="flex flex-col h-full justify-start text-left">
          <h3 class="text-xl font-bold mb-1">Links Úteis</h3>
          <div class="w-[10%] border-b-2 border-red-500 mb-3"></div>
          <ul class="space-y-3 text-sm">
            <li>
              <a
                href="/contacto"
                class="transition-colors duration-300 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:underline"
              >
                Contactos
              </a>
            </li>
            <li>
              <a
                href="/politicas/cookies"
                class="transition-colors duration-300 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:underline"
              >
                Política de Cookies
              </a>
            </li>
            <li>
              <a
                href="/politicas/privacidade"
                class="transition-colors duration-300 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:underline"
              >
                Política de Privacidade
              </a>
            </li>
            <li>
              <a
                href="/politicas/servico"
                class="transition-colors duration-300 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:underline"
              >
                Termos de Serviço
              </a>
            </li>
          </ul>
        </div>

        <div class="flex flex-col h-full justify-start text-left">
          <h3 class="text-xl font-bold mb-1">Redes Sociais</h3>
          <div class="w-[10%] border-b-2 border-red-500 mb-3"></div>
          <ul class="space-y-3 text-sm">
            <li>
              <a
                href="https://www.facebook.com/a.mshoes/"
                target="_blank"
                class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:underline transition-colors duration-300"
              >
                <PhFacebookLogo class="w-6 h-6 fill-current" />
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/a.mshoes/"
                target="_blank"
                class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:underline transition-colors duration-300"
              >
                <PhInstagramLogo class="w-6 h-6 fill-current" />
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@a.mshoes"
                target="_blank"
                class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:underline transition-colors duration-300"
              >
                <PhTiktokLogo class="w-6 h-6 fill-current" />
                <span>Tiktok</span>
              </a>
            </li>
          </ul>
        </div>

        <div class="flex flex-col h-full justify-start text-left">
          <h3 class="text-xl font-bold mb-1">Contacto</h3>
          <div class="w-[10%] border-b-2 border-red-500 mb-3"></div>
          <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li class="flex items-center space-x-2">
              <PhPhone class="w-5 h-5 fill-current" />
              <a
                href="tel:+351914199067"
                class="hover:text-red-500 hover:underline transition-colors duration-300"
              >
                914 199 067
              </a>
            </li>
            <li class="flex items-center space-x-2">
              <PhPhone class="w-5 h-5 fill-current" />
              <a
                href="tel:+351914765391"
                class="hover:text-red-500 hover:underline transition-colors duration-300"
              >
                914 765 391
              </a>
            </li>
          </ul>
        </div>
      </div>

      <hr
        class="border-t-2 border-gray-300 dark:border-gray-700 my-6 w-full mx-auto"
      />

      <p class="text-center text-xs text-gray-700 dark:text-gray-300 mt-8">
        Copyright © {{ new Date().getFullYear() }} AM Shoes. Todos os direitos
        reservados.
      </p>

      <p class="text-center text-xs text-gray-700 dark:text-gray-300 mt-1">
        Feito por
        <a
          href="https://instagram.com/webcreaterpt"
          target="_blank"
          rel="noopener"
          class="hover:text-red-500 hover:underline transition-colors duration-300 text-gray-700 dark:text-gray-300"
        >
          Webcreaterpt
        </a>
      </p>
    </div>
  </footer>
</template>
