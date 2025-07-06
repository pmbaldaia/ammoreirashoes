<script setup>
const sponsors = [
  { src: "/patrocinios/garage649.jpeg", alt: "M Pinto" },
  { src: "/patrocinios/mpinto.jpeg", alt: "M Pinto" },
  { src: "/patrocinios/cfds-logo-white.svg", alt: "CFDS" },
  { src: "/patrocinios/fronteiratenciosa.png", alt: "FronteiraTenciosa" },
  { src: "/patrocinios/casacarreira.jpeg", alt: "Casa da Carreira" },
  { src: "/patrocinios/carvalhaparque.png", alt: "Carvalha Parque" },
  { src: "/patrocinios/fontevelha.JPEG", alt: "Fonte Velha" },
  { src: "/patrocinios/allianz.jpeg", alt: "Allianz" },
  { src: "/patrocinios/amstransportes.jpeg", alt: "AMS Transportes" },
  { src: "/patrocinios/bjconstrucoes.jpeg", alt: "BJ Construções" },
  { src: "/patrocinios/carlosmorango.jpeg", alt: "Carlos Morango" },
  { src: "/patrocinios/cmcar.jpeg", alt: "CM Car" },
  { src: "/patrocinios/construcao.png", alt: "Construção" },
  { src: "/patrocinios/farmaciamoreira.jpeg", alt: "Farmácia Moreira" },
  { src: "/patrocinios/fribeiro.jpeg", alt: "Fribeiro" },
  { src: "/patrocinios/idmconstruct.jpeg", alt: "IDM Construct" },
  { src: "/patrocinios/iluminacoescampos.jpeg", alt: "Iluminações Campos" },
  { src: "/patrocinios/jardeco.jpeg", alt: "Jardeco" },
  { src: "/patrocinios/luis moreira.jpg", alt: "Luís Moreira" },
  { src: "/patrocinios/mocacar.jpeg", alt: "Mocacar" },
  { src: "/patrocinios/nortenha.jpeg", alt: "Nortenha" },
  { src: "/patrocinios/oliveIrapadaria.jpeg", alt: "Oliveira Padaria" },
  { src: "/patrocinios/pardais.jpeg", alt: "Pardais" },
  { src: "/patrocinios/piscinaspaulo.jpeg", alt: "Piscinas Paulo" },
  { src: "/patrocinios/pizzariamoderna.jpeg", alt: "Pizzaria Moderna" },
  { src: "/patrocinios/pneusribeiro.jpeg", alt: "Pneus Ribeiro" },
  { src: "/patrocinios/quintaagualeveda.jpeg", alt: "Quinta Água Levada" },
  { src: "/patrocinios/realcafes.jpeg", alt: "Real Cafés" },
  {
    src: "/patrocinios/restauranterecesinhos.jpeg",
    alt: "Restaurante e Receisinhos",
  },
  { src: "/patrocinios/rimaquinas.jpeg", alt: "Rimaquinas" },
  { src: "/patrocinios/sigaseguro.jpeg", alt: "SigaSeguro" },
  { src: "/patrocinios/sofas.png", alt: "Sofas" },
  { src: "/patrocinios/splcar.jpeg", alt: "SPL Car" },
  { src: "/patrocinios/steelferreiro.jpeg", alt: "Steel Ferreiro" },
  { src: "/patrocinios/tabernacruz.jpeg", alt: "Taberna Cruz" },
  { src: "/patrocinios/tamega.jpeg", alt: "Tâmega" },
  { src: "/patrocinios/tiagomoreira.jpeg", alt: "Tiago Moreira" },
  { src: "/patrocinios/triunfoclassico.jpeg", alt: "Triunfo Clássico" },
  { src: "/patrocinios/vataxi.jpeg", alt: "VA Táxi" },
  { src: "/patrocinios/zecananda.jpeg", alt: "Zé Cananda" },
];
</script>

<template>
  <section class="mt-24">
    <h2
      class="text-black dark:text-white text-3xl md:text-4xl font-bold text-center"
    >
      Patrocínios
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 mt-10 px-4">
      <img
        v-for="(sponsor, i) in sponsors"
        :key="i"
        :src="sponsor.src"
        :alt="sponsor.alt"
        class="object-contain h-[120px] w-full max-w-[160px] mx-auto transition-transform duration-300 hover:scale-150"
        :class="{
          'bg-black':
            sponsor.alt === 'CFDS' && !$colorMode?.value?.includes('dark'),
          'p-2': sponsor.alt === 'CFDS',
        }"
      />
    </div>
  </section>
</template>

