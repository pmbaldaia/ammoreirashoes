<script setup lang="ts">
const { isDark } = useThemeMode()
definePageMeta({ layout: "admin-auth" });
const username = ref("");
const password = ref("");
const pending = ref(false);
const error = ref("");
const { login } = useAuth();
const toast = useToast();
onMounted(async () => {
  const raw = window.location.hash.startsWith("#token=")
    ? decodeURIComponent(window.location.hash.slice(7))
    : "";
  if (raw) {
    const { token, me } = useAuth();
    token.value = raw;
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    try {
      await me();
      await navigateTo("/admin");
    } catch {
      token.value = null;
    }
  }
});
async function submit() {
  error.value = "";
  pending.value = true;
  try {
    await login(username.value, password.value);
    toast.success('Sessão iniciada', 'Bem-vindo à gestão da AM Moreira.');
    await navigateTo("/admin");
  } catch (e: any) {
    error.value =
      e?.data?.message || e?.message || "Não foi possível iniciar sessão";
    toast.error('Login inválido', error.value);
  } finally {
    pending.value = false;
  }
}
</script>
<template>
  <section class="auth-card">
    <img :src="isDark ? '/brand/logo-branco.png' : '/brand/logo-preto.png'" alt="AM Moreira" class="brand-logo-original auth-logo" />
    <p class="eyebrow">Área reservada</p>
    <h1>AM Moreira</h1>
    <p>Inicia sessão para gerir os conteúdos do site.</p>
    <form @submit.prevent="submit" class="auth-form">
      <label class="form-field"
        ><span>Utilizador</span
        ><input
          v-model.trim="username"
          type="text"
          autocomplete="username"
          required /></label
      ><label class="form-field"
        ><span>Palavra-passe</span
        ><input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          minlength="8"
      /></label>
      <p v-if="error" class="cms-alert cms-alert--danger">{{ error }}</p>
      <button class="btn btn--primary" :disabled="pending">
        {{ pending ? "A entrar…" : "Entrar" }}
      </button>
      <NuxtLink class="auth-recovery-link" to="/admin/recuperar-password">Esqueceste-te da palavra-passe?</NuxtLink>
    </form>
  </section>
</template>
