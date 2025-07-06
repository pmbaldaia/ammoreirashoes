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
          <span class="text-gray-900 dark:text-white">Política de Cookies</span>
          <div class="mt-5 w-32 h-px flex rounded-sm overflow-hidden">
            <div class="w-1/2 bg-red-600"></div>
            <div class="w-1/2 bg-green-600"></div>
          </div>
        </div>
      </template>

      <template #desc>
        <span class="text-slate-600 dark:text-gray-300">
          O G.D.C.S.S. Castelões utiliza cookies para proporcionar uma navegação
          mais eficiente e personalizada. A nossa Política de Cookies visa
          esclarecer como e por que motivo utilizamos cookies no nosso site.
        </span>
      </template>
    </LandingSectionhead>

    <div class="mt-8 text-lg text-slate-600 dark:text-gray-200">
      <p class="mb-6">
        A utilização de cookies no site do G.D.C.S.S. Castelões tem como
        objetivo garantir a melhor experiência de navegação, permitindo-nos
        personalizar conteúdos e funcionalidades. Ao continuar a navegar neste
        site, você concorda com a utilização de cookies conforme descrito nesta
        política.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        1. O que são Cookies?
      </h3>
      <p class="mb-4">
        Cookies são pequenos ficheiros de texto que são armazenados no seu
        dispositivo quando você visita um site. Estes ficheiros contêm
        informações sobre a sua navegação, permitindo que o site "lembre" as
        suas preferências e o comportamento anterior, como as páginas visitadas
        e os itens selecionados.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        2. Tipos de Cookies Utilizados
      </h3>
      <div class="mb-4">
        Utilizamos diferentes tipos de cookies para as seguintes finalidades:
        <ul class="list-disc pl-6 mb-4">
          <li>
            <strong>Cookies Essenciais:</strong> Necessários para o
            funcionamento básico do site, como lembrar as preferências de
            navegação;
          </li>
          <li>
            <strong>Cookies Analíticos:</strong> Usados para recolher dados
            sobre o uso do site, permitindo-nos analisar o comportamento dos
            utilizadores e melhorar a experiência;
          </li>
          <li>
            <strong>Cookies de Publicidade:</strong> Utilizados para
            personalizar anúncios e ofertas com base nos interesses dos
            utilizadores.
          </li>
        </ul>
      </div>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        3. Como Gerir os Cookies
      </h3>
      <p class="mb-4">
        Você pode alterar as configurações do seu navegador para recusar cookies
        ou alertá-lo sempre que um cookie for enviado para o seu dispositivo. No
        entanto, tenha em mente que desativar cookies pode afetar algumas
        funcionalidades do nosso site.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        4. Consentimento para Utilização de Cookies
      </h3>
      <p class="mb-4">
        Ao continuar a navegar no nosso site, você consente com a utilização de
        cookies conforme descrito nesta Política de Cookies. Caso não concorde,
        recomendamos que altere as configurações do seu navegador ou pare de
        utilizar o nosso site.
      </p>

      <p class="mt-6">
        Para mais informações ou esclarecimentos sobre a nossa Política de
        Cookies, por favor, entre em contacto connosco.
      </p>
    </div>
  </LandingContainer>
</template>
