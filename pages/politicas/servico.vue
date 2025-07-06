<script setup>
definePageMeta({
  layout: "landing",
});
</script>

<template>
  <LandingContainer>
    <LandingSectionhead>
      <template #title>
        <div class="flex flex-col items-center">
          <span class="text-gray-900 dark:text-white">Termos de Serviço</span>
          <div class="mt-5 w-32 h-px flex rounded-sm overflow-hidden">
            <div class="w-1/2 bg-red-600"></div>
            <div class="w-1/2 bg-green-600"></div>
          </div>
        </div>
      </template>

      <template #desc>
        <span class="text-slate-600 dark:text-gray-300">
          Os Termos de Serviço estabelecem as condições para o uso do site do
          G.D.C.S.S. Castelões. Ao aceder ou utilizar o nosso site, você
          concorda em cumprir os termos e condições descritos abaixo.
        </span>
      </template>
    </LandingSectionhead>

    <div class="mt-8 text-lg text-slate-600 dark:text-gray-200">
      <p class="mb-6">
        Estes Termos de Serviço regulam o acesso e a utilização do site do
        G.D.C.S.S. Castelões. Ao utilizar o nosso site, você concorda em cumprir
        e ser vinculado por estes termos, que podem ser alterados
        periodicamente.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        1. Aceitação dos Termos
      </h3>
      <p class="mb-4">
        Ao acessar e utilizar este site, o utilizador reconhece que leu,
        compreendeu e concorda com os Termos de Serviço descritos nesta página.
        Caso não concorde com algum dos termos, solicitamos que se abstenha de
        utilizar o nosso site.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        2. Direitos de Propriedade Intelectual
      </h3>
      <p class="mb-4">
        Todo o conteúdo do site, incluindo textos, imagens, vídeos, logótipos e
        marcas registradas, é protegido por direitos autorais e outros direitos
        de propriedade intelectual. O uso não autorizado desse conteúdo é
        estritamente proibido, salvo em caso de permissão explícita.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        3. Responsabilidades do Utilizador
      </h3>
      <p class="mb-4">
        O utilizador compromete-se a utilizar o site de forma responsável,
        respeitando as leis aplicáveis e não prejudicando a experiência de
        outros utilizadores. Qualquer comportamento que infrinja as normas
        legais ou os direitos de propriedade intelectual poderá resultar em
        ações legais.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        4. Limitação de Responsabilidade
      </h3>
      <p class="mb-4">
        O G.D.C.S.S. Castelões não se responsabiliza por quaisquer danos diretos
        ou indiretos resultantes da utilização do site, incluindo, mas não se
        limitando a, falhas técnicas, interrupções no acesso ou dados
        incorretos.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        5. Modificação dos Termos
      </h3>
      <p class="mb-4">
        O G.D.C.S.S. Castelões reserva-se o direito de modificar estes Termos de
        Serviço a qualquer momento. Quaisquer alterações serão publicadas nesta
        página e estarão em vigor a partir da data da publicação.
      </p>

      <p class="mt-6">
        Para qualquer dúvida ou esclarecimento adicional sobre os Termos de
        Serviço, por favor, entre em contacto conosco.
      </p>
    </div>
  </LandingContainer>
</template>
