<script setup lang="ts">
definePageMeta({ layout: 'admin-auth' })
const route = useRoute()
const token = computed(() => String(route.query.token || ''))
const email = ref(''), password = ref(''), confirmPassword = ref('')
const pending = ref(false), sent = ref(false), done = ref(false), error = ref('')
const { isDark } = useThemeMode()
async function requestLink() {
  error.value = ''; pending.value = true
  try { await $fetch('/api/auth/forgot-password', { method: 'POST', body: { email: email.value } }); sent.value = true }
  catch (e: any) { error.value = e?.data?.message || 'Não foi possível enviar o pedido. Tenta novamente.' }
  finally { pending.value = false }
}
async function resetPassword() {
  error.value = ''
  if (password.value !== confirmPassword.value) { error.value = 'A confirmação da palavra-passe não coincide.'; return }
  pending.value = true
  try { await $fetch('/api/auth/reset-password', { method: 'POST', body: { token: token.value, password: password.value, confirmPassword: confirmPassword.value } }); done.value = true }
  catch (e: any) { error.value = e?.data?.message || 'Não foi possível redefinir a palavra-passe.' }
  finally { pending.value = false }
}
</script>
<template><section class="auth-card"><img :src="isDark ? '/brand/logo-branco.png' : '/brand/logo-preto.png'" alt="AM Moreira" class="brand-logo-original auth-logo"><template v-if="token"><p class="eyebrow">Nova palavra-passe</p><h1>Define uma nova palavra-passe</h1><p v-if="!done">Escolhe uma palavra-passe com pelo menos 8 caracteres.</p><p v-else class="cms-alert cms-alert--success">Palavra-passe atualizada. Já podes iniciar sessão.</p><form v-if="!done" class="auth-form" @submit.prevent="resetPassword"><label class="form-field"><span>Nova palavra-passe</span><input v-model="password" type="password" autocomplete="new-password" minlength="8" required></label><label class="form-field"><span>Confirmar nova palavra-passe</span><input v-model="confirmPassword" type="password" autocomplete="new-password" minlength="8" required></label><p v-if="error" class="cms-alert cms-alert--danger">{{ error }}</p><button class="btn btn--primary" :disabled="pending">{{ pending ? 'A guardar…' : 'Atualizar palavra-passe' }}</button></form></template><template v-else><p class="eyebrow">Recuperar acesso</p><h1>Esqueceste-te da palavra-passe?</h1><p v-if="!sent">Indica o email associado à tua conta. Enviaremos um link válido durante uma hora.</p><p v-else class="cms-alert cms-alert--success">Se existir uma conta associada a este email, receberás um link de recuperação.</p><form v-if="!sent" class="auth-form" @submit.prevent="requestLink"><label class="form-field"><span>Email associado</span><input v-model.trim="email" type="email" autocomplete="email" required></label><p v-if="error" class="cms-alert cms-alert--danger">{{ error }}</p><button class="btn btn--primary" :disabled="pending">{{ pending ? 'A enviar…' : 'Enviar link' }}</button></form></template><NuxtLink class="auth-recovery-link" to="/admin/login">Voltar ao login</NuxtLink></section></template>
