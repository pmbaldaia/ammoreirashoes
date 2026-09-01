<template>
  <div class="relative min-h-screen text-neutral-900 flex flex-col overflow-hidden">
    <NuxtImg
      src="/campo/campo.webp"
      alt=""
      aria-hidden="true"
      width="1920"
      height="1080"
      sizes="100vw"
      quality="75"
      loading="eager"
      fetchpriority="high"
      class="absolute inset-0 w-full h-full object-cover -z-20"
    />
    <div class="absolute inset-0 bg-black/50 pointer-events-none -z-10" />

    <div class="relative z-10 flex-1"><slot /></div>
  </div>
</template>
