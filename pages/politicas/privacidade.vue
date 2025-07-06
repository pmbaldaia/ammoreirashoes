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
          <span class="text-gray-900 dark:text-white"
            >Política de Privacidade</span
          >
          <div class="mt-5 w-32 h-px flex rounded-sm overflow-hidden">
            <div class="w-1/2 bg-red-600"></div>
            <div class="w-1/2 bg-green-600"></div>
          </div>
        </div>
      </template>

      <template #desc>
        <span class="text-slate-600 dark:text-gray-300">
          O G.D.C.S.S. Castelões preza pela transparência e segurança dos seus
          dados pessoais. A nossa Política de Privacidade visa esclarecer de que
          forma recolhemos, utilizamos, protegemos e partilhamos as suas
          informações pessoais.
        </span>
      </template>
    </LandingSectionhead>

    <div class="mt-8 text-lg text-slate-600 dark:text-gray-200">
      <p class="mb-6">
        O G.D.C.S.S. Castelões está comprometido com a proteção da sua
        privacidade. Esta Política de Privacidade foi desenvolvida para informar
        os nossos utilizadores sobre os dados pessoais que recolhemos, a
        finalidade da recolha e os seus direitos em relação ao tratamento das
        suas informações.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        1. Dados Pessoais Recolhidos
      </h3>
      <p class="mb-4">
        Recolhemos informações pessoais, como nome, endereço de e-mail, dados de
        contacto e informações necessárias para a inscrição em eventos ou outros
        serviços prestados pelo clube. Além disso, podemos recolher dados de
        navegação, como o seu endereço IP, localização geográfica e
        comportamento de navegação.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        2. Finalidade da Recolha dos Dados
      </h3>
      <div class="mb-4">
        Os dados pessoais recolhidos são utilizados para as seguintes
        finalidades:
        <ul class="list-disc pl-6 mb-4">
          <li>
            Gestão de inscrições em eventos, torneios e outras atividades
            promovidas pelo clube;
          </li>
          <li>
            Envio de informações relevantes sobre eventos, atividades e outras
            atualizações;
          </li>
          <li>
            Melhoria da experiência do utilizador ao adaptar os conteúdos e
            serviços às suas preferências;
          </li>
          <li>Cumprimento de obrigações legais e regulatórias.</li>
        </ul>
      </div>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        3. Proteção dos Dados Pessoais
      </h3>
      <p class="mb-4">
        O G.D.C.S.S. Castelões adota as melhores práticas de segurança para
        proteger os dados pessoais dos nossos utilizadores. Implementamos
        medidas técnicas e organizacionais adequadas para garantir que as suas
        informações pessoais estejam seguras contra acessos não autorizados,
        perda ou alteração indevida.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        4. Direitos dos Utilizadores
      </h3>
      <p class="mb-4">
        De acordo com a legislação em vigor, os utilizadores têm o direito de
        acessar, corrigir, atualizar ou excluir os seus dados pessoais. Caso
        deseje exercer algum desses direitos, ou se tiver alguma dúvida sobre o
        tratamento dos seus dados, por favor entre em contacto connosco através
        do nosso canal de suporte.
      </p>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        5. Cookies
      </h3>
      <p class="mb-4">
        Utilizamos cookies para melhorar a sua experiência no nosso site. Para
        mais informações sobre como utilizamos cookies, consulte a nossa
        <a href="/cookies" class="text-red-800 dark:text-red-400"
          >Política de Cookies</a
        >.
      </p>

      <p class="mt-6">
        Ao utilizar o nosso site, você concorda com os termos desta Política de
        Privacidade, incluindo a recolha e utilização dos seus dados pessoais
        conforme descrito. Para mais informações, não hesite em contactar-nos.
      </p>
    </div>
  </LandingContainer>
</template>
