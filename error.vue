<script setup lang="ts">
const error = useError()
const { isDark } = useThemeMode()
const statusCode = computed(() => Number(error.value?.statusCode) || 500)
const title = computed(() => statusCode.value === 404 ? 'Página não encontrada' : 'Ocorreu um erro')
const description = computed(() => statusCode.value === 404
  ? 'A página que procuras não existe ou já não está disponível.'
  : 'Não foi possível concluir este pedido. Tenta novamente ou volta ao início.')
const goHome = () => clearError({ redirect: '/' })
</script>

<template>
  <main class="site-error" role="main">
    <section class="site-error__card" aria-labelledby="error-title">
      <img :src="isDark ? '/brand/logo-branco.png' : '/brand/logo-preto.png'" alt="AM Moreira" class="site-error__logo">
      <p class="site-error__code">{{ statusCode }}</p>
      <h1 id="error-title">{{ title }}</h1>
      <p>{{ description }}</p>
      <button type="button" class="am-btn" @click="goHome">Voltar ao início</button>
    </section>
  </main>
</template>
