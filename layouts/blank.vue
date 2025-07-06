<template>
  <div
    class="min-h-screen text-gray-900 dark:text-gray-100 flex flex-col bg-cover bg-center bg-no-repeat relative"
    :style="{ backgroundImage: 'url(/campo/campo.jpg)' }"
  >
    <div class="absolute inset-0 pointer-events-none bg-black/50"></div>

    <NuxtPage class="relative z-10" />
  </div>
</template>
