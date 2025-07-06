<template>
  <div
    class="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300 pb-4"
  >
    <LandingNavbar />
    <main
      class="flex-grow pt-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24"
    >
      <div class="max-w-screen-xl w-full mx-auto">
        <NuxtPage />
      </div>
    </main>

    <LandingFooter />
  </div>
</template>
