<script setup>
import { ref, onMounted } from "vue";
import {
  PhMoon,
  PhSun,
  PhInstagramLogo,
  PhFacebookLogo,
  PhTiktokLogo,
  PhList,
  PhX,
} from "@phosphor-icons/vue";

import { useRoute } from "vue-router";

const colorMode = useColorMode();
const open = ref(false);
const isMounted = ref(false);
const route = useRoute();

const toggleTheme = () => {
  colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
};

const menuitems = [
  { title: "Teste 1", path: "/teste1/" },
  { title: "Teste 2", path: "/teste2/" },
  { title: "Teste 3", path: "/teste3/" },
  { title: "Teste 4", path: "/teste4/" },
];

onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <LandingContainer>
    <header
      class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md"
    >
      <div
        class="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row justify-between items-center pt-5 pb-5"
      >
        <div class="flex w-full lg:w-auto items-center justify-between">
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

          <div
            class="flex items-center space-x-4 lg:hidden mr-5"
            v-if="isMounted"
          >
            <button
              @click="toggleTheme"
              :aria-label="
                colorMode.preference === 'dark'
                  ? 'Alternar para tema claro'
                  : 'Alternar para tema escuro'
              "
              class="hover:text-green-700 transition w-6 h-6 flex items-center justify-center"
            >
              <PhSun
                v-if="colorMode.preference === 'dark'"
                class="w-6 h-6 text-white"
              />
              <PhMoon v-else class="w-6 h-6 text-gray-900" />
            </button>

            <button
              @click="open = !open"
              :class="
                colorMode.preference === 'dark' ? 'text-white' : 'text-gray-800'
              "
              aria-label="Menu"
            >
              <PhX v-if="open" class="w-6 h-6" />
              <PhList v-else class="w-6 h-6" />
            </button>
          </div>
        </div>

        <nav
          v-if="isMounted"
          class="w-full lg:w-auto mt-2 lg:flex lg:mt-0"
          :class="{ block: open, hidden: !open }"
        >
          <ul
            class="flex flex-col items-center text-center lg:flex-row lg:gap-3"
          >
            <li v-for="item in menuitems" :key="item.path">
              <NuxtLink
                :to="item.path"
                @click="open = false"
                :class="[
                  'flex lg:px-3 py-2 transition-all duration-300 text-black dark:text-white hover:text-green-900 dark:hover:text-green-400',
                  (
                    item.path === '/eventos/'
                      ? route.path === '/eventos/' ||
                        route.path.startsWith('/eventos/')
                      : route.path === item.path
                  )
                    ? colorMode.preference === 'dark'
                      ? 'border-b-2 border-white'
                      : 'border-b-2 border-black'
                    : 'border-b-2 border-transparent',
                ]"
              >
                {{ item.title }}
              </NuxtLink>
            </li>
          </ul>

          <div
            class="lg:hidden flex justify-center items-center mt-3 gap-4 w-full"
          >
            <a
              href="https://www.instagram.com/gdcsscasteloes/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <PhInstagramLogo class="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com/gdcscasteloes/"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <PhFacebookLogo class="w-6 h-6" />
            </a>
            <a
              href="https://www.tiktok.com/@a.mshoes"
              target="_blank"
              aria-label="Tiktok"
              rel="noopener noreferrer"
            >
              <PhTiktokLogo class="w-6 h-6" />
            </a>
          </div>
        </nav>

        <div class="hidden lg:flex items-center gap-4">
          <a
            href="https://www.instagram.com/gdcsscasteloes/"
            target="_blank"
            aria-label="Instagram"
          >
            <PhInstagramLogo class="w-6 h-6" />
          </a>
          <a
            href="https://www.facebook.com/gdcscasteloes/"
            target="_blank"
            aria-label="Facebook"
          >
            <PhFacebookLogo class="w-6 h-6" />
          </a>
          <a
            href="https://www.tiktok.com/@a.mshoes"
            target="_blank"
            aria-label="Tiktok"
            rel="noopener noreferrer"
          >
            <PhTiktokLogo class="w-6 h-6" />
          </a>
          <button
            v-if="isMounted"
            @click="toggleTheme"
            :aria-label="
              colorMode.preference === 'dark'
                ? 'Alternar para tema claro'
                : 'Alternar para tema escuro'
            "
            class="hover:text-green-700 transition w-6 h-6 flex items-center justify-center"
          >
            <PhSun
              v-if="colorMode.preference === 'dark'"
              class="w-6 h-6 text-white"
            />
            <PhMoon v-else class="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>
      <hr
        class="border-t-2 border-gray-200 dark:border-gray-700 w-full mx-auto"
      />
    </header>
  </LandingContainer>
</template>
