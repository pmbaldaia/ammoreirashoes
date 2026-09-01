<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { user, updateProfile } = useAuth()
const toast = useToast()
const form = reactive({ name: '', avatar: '', currentPassword: '', password: '', confirmPassword: '' })
const saving = ref(false)

watch(user, value => {
  form.name = value?.name || ''
  form.avatar = value?.avatar || ''
}, { immediate: true })

async function saveProfile() {
  if (!form.name.trim()) return toast.error('Nome obrigatório', 'Indica o teu nome para continuar.')
  if ((form.password || form.currentPassword || form.confirmPassword) && form.password !== form.confirmPassword) {
    return toast.error('Palavras-passe diferentes', 'A confirmação deve coincidir com a nova palavra-passe.')
  }
  saving.value = true
  try {
    await updateProfile({ ...form, name: form.name.trim() })
    form.currentPassword = ''
    form.password = ''
    form.confirmPassword = ''
    toast.success('Perfil atualizado', 'As tuas alterações foram guardadas.')
  } catch (error: any) {
    toast.error('Não foi possível guardar', error?.data?.message || error?.message || 'Tenta novamente.')
  } finally { saving.value = false }
}
</script>

<template>
  <div class="page-stack profile-page">
    <header class="page-heading">
      <div><p class="eyebrow">Conta</p><h1>O meu perfil</h1><p class="page-heading__description">Atualiza a tua imagem, nome e palavra-passe.</p></div>
    </header>
    <form class="panel profile-form" @submit.prevent="saveProfile">
      <section class="profile-form__section">
        <div><h2>Imagem de perfil</h2><p>Escolhe uma imagem pessoal ou carrega uma nova.</p></div>
        <CmsSingleImagePicker v-model="form.avatar" label="Imagem de perfil" recommended="Recomendado: imagem quadrada, pelo menos 320 × 320 px." />
      </section>
      <section class="profile-form__section">
        <div><h2>Dados pessoais</h2><p>O email e o perfil de acesso são geridos pelo administrador.</p></div>
        <label class="form-field"><span>Nome</span><input v-model="form.name" autocomplete="name" required></label>
        <label class="form-field"><span>Email</span><input :value="user?.email" type="email" disabled></label>
      </section>
      <section class="profile-form__section">
        <div><h2>Alterar palavra-passe</h2><p>Preenche estes campos apenas se quiseres alterar a palavra-passe.</p></div>
        <label class="form-field"><span>Palavra-passe atual</span><input v-model="form.currentPassword" type="password" autocomplete="current-password"></label>
        <label class="form-field"><span>Nova palavra-passe</span><input v-model="form.password" type="password" minlength="8" autocomplete="new-password"></label>
        <label class="form-field"><span>Confirmar nova palavra-passe</span><input v-model="form.confirmPassword" type="password" minlength="8" autocomplete="new-password"></label>
      </section>
      <footer class="profile-form__footer"><button class="btn btn--primary" :disabled="saving"><Icon name="lucide:save" />{{ saving ? 'A guardar…' : 'Guardar alterações' }}</button></footer>
    </form>
  </div>
</template>
