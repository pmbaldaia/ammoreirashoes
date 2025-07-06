<script setup>
const features = [
  {
    title: "Calçado com Estilo",
    description:
      "Modelos modernos e elegantes para todas as idades. Trazemos a moda até ti em cada feira.",
    icon: "mdi:shoe-formal",
  },
  {
    title: "Conforto Garantido",
    description:
      "O teu bem-estar é a nossa prioridade. Trabalhamos com materiais confortáveis e resistentes.",
    icon: "mdi:feet",
  },
  {
    title: "Qualidade a Preço Justo",
    description:
      "Aliamos qualidade e durabilidade a preços acessíveis. Porque todos merecem calçado de confiança.",
    icon: "mdi:tag-check",
  },
  {
    title: "Estamos Perto de Ti",
    description:
      "Marcamos presença em várias feiras da região. Um atendimento personalizado, onde quer que estejas.",
    icon: "mdi:storefront",
  },
  {
    title: "Variedade para Todos",
    description:
      "Desde calçado desportivo a clássico, homem, mulher e criança — temos opções para todos os gostos.",
    icon: "mdi:shoe-sneaker",
  },
  {
    title: "Confiança que se Sente",
    description:
      "Clientes fiéis e satisfeitos há anos. A nossa reputação é construída com honestidade e dedicação.",
    icon: "mdi:handshake",
  },
];
</script>
<template>
  <div
    class="mt-16 pt-5 pb-8 md:pt-8 px-4 sm:px-4 md:px-8 max-w-screen-xl mx-auto"
  >
    <h2
      class="text-2xl lg:text-3xl font-bold lg:tracking-tight text-gray-900 dark:text-white"
    >
      Calçado com Qualidade, Conforto e Estilo — Sempre Perto de Ti
    </h2>

    <p class="text-slate-600 dark:text-gray-300 mt-2">
      Descobre a nossa oferta nas feiras da região. Estamos aqui para te
      oferecer o melhor em calçado, com atendimento personalizado e produtos que
      fazem a diferença.
    </p>
  </div>

  <div
    class="grid sm:grid-cols-2 md:grid-cols-3 mt-16 gap-16 pt-5 pb-8 md:pt-8 px-4 sm:px-4 md:px-8 max-w-screen-xl mx-auto"
  >
    <div
      v-for="(item, index) in features"
      :key="item.title"
      class="flex gap-4 items-start"
    >
      <div
        :class="[
          'mt-1 rounded-full p-2 w-8 h-8 shrink-0',
          index % 2 === 0 ? 'bg-green-800' : 'bg-red-800',
        ]"
      >
        <Icon class="text-white" :name="item.icon" />
      </div>
      <div>
        <h3 class="font-semibold text-lg text-gray-800 dark:text-white">
          {{ item.title }}
        </h3>
        <p class="text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>