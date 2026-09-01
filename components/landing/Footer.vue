<script setup lang="ts">
const year = new Date().getFullYear()
const { settings, loadSettings } = usePublicContent()
await loadSettings()
const phoneHref = (phone:string) => `tel:+351${phone.replace(/\D/g,'')}`
const socialLinks = computed(() => [
  { key:'instagram', label:'Instagram', icon:'simple-icons:instagram', url:settings.value.instagramUrl },
  { key:'facebook', label:'Facebook', icon:'simple-icons:facebook', url:settings.value.facebookUrl },
  { key:'linkedin', label:'LinkedIn', icon:'simple-icons:linkedin', url:settings.value.linkedinUrl },
  { key:'tiktok', label:'TikTok', icon:'simple-icons:tiktok', url:settings.value.tiktokUrl },
  { key:'snapchat', label:'Snapchat', icon:'simple-icons:snapchat', url:settings.value.snapchatUrl },
  { key:'twitter', label:'Twitter / X', icon:'simple-icons:x', url:settings.value.twitterUrl },
].filter((social) => Boolean(social.url)))
</script>
<template><footer class="am-footer"><div class="am-wrap am-footer__grid"><div><img :src="settings.logoLight" :alt="settings.brand||settings.name"><p>{{settings.description}}</p></div><div><strong>{{ settings.footerContactsTitle || 'Contactos' }}</strong><p><template v-for="phone in settings.phones||[]" :key="phone"><a :href="phoneHref(phone)">{{phone}}</a><br></template><a v-if="settings.email" :href="`mailto:${settings.email}`">{{settings.email}}</a></p><div v-if="socialLinks.length" class="am-social-links" :aria-label="settings.footerSocialTitle || 'Redes sociais'"><a v-for="social in socialLinks" :key="social.key" :href="social.url" target="_blank" rel="noopener noreferrer" :aria-label="social.label" :title="social.label"><Icon :name="social.icon" size="19" /></a></div></div><div><strong>{{ settings.footerPresenceTitle || 'Presença' }}</strong><p>{{(settings.locations||[]).join(' · ')}}</p><small>{{ settings.footerCopyright || `© ${year} ${settings.name}` }}</small></div></div></footer></template>
