<script setup lang="ts">
definePageMeta({ layout: 'admin' });
import {mediaService,type MediaItem} from '~/modules/media/service/media.service';const {user}=useAuth();const isAdmin=computed(()=>user.value?.role==='admin');const media=mediaService();const toast=useToast();const confirmDialog=useConfirm();const items=ref<MediaItem[]>([]);const pending=ref(false);const error=ref('');async function load(){pending.value=true;try{items.value=await media.list()}catch(e:any){error.value=e?.data?.message||e.message}finally{pending.value=false}}async function upload(e:Event){const file=(e.target as HTMLInputElement).files?.[0];if(!file)return;pending.value=true;try{await media.upload(file);toast.success('Ficheiro carregado','O ficheiro já está disponível na biblioteca.');await load()}catch(err:any){error.value=err?.data?.message||err.message;toast.error('Erro no upload',error.value)}finally{pending.value=false;(e.target as HTMLInputElement).value=''}}async function del(item:MediaItem){
  const accepted=await confirmDialog.ask({
    title:'Eliminar ficheiro?',
    message:`Vais eliminar “${item.name}” da biblioteca. Se estiver a ser usado no site, a imagem ou documento deixará de estar disponível.`,
    confirmLabel:'Sim, eliminar',
    cancelLabel:'Cancelar',
    tone:'danger'
  });
  if(!accepted)return;
  try{
    await media.remove(item.id);
    await load();
    toast.success('Ficheiro eliminado',`${item.name} foi removido da biblioteca.`);
  }catch(err:any){
    toast.error('Erro ao eliminar',err?.data?.message||err.message||'Não foi possível eliminar o ficheiro.');
  }
}async function copy(url:string){try{await navigator.clipboard.writeText(url);toast.success('Endereço copiado','O endereço da imagem foi copiado para a área de transferência.',2400)}catch{toast.error('Não foi possível copiar','Copia o endereço manualmente.')}}onMounted(load)</script>
<template><div class="page-stack"><header class="page-heading"><div><p class="eyebrow">Biblioteca</p><h1>Multimédia</h1><p class="page-heading__description">Imagens e documentos usados pelo site e pelo CMS.</p></div><label v-if="isAdmin" class="btn btn--primary"><Icon name="lucide:upload"/> Carregar ficheiro<input type="file" accept="image/*,.pdf" hidden @change="upload"></label></header><p v-if="error" class="cms-alert cms-alert--danger">{{error}}</p><div v-if="pending" class="cms-loading">A carregar…</div><div v-else-if="!items.length" class="panel empty-state"><Icon name="lucide:image-off" size="30"/><h3>Biblioteca vazia</h3><p>Carrega a primeira imagem ou documento.</p></div><section v-else class="media-grid"><article v-for="item in items" :key="item.id" class="media-card"><img v-if="!item.name.toLowerCase().endsWith('.pdf')" :src="item.url" :alt="item.name"><div v-else class="empty-state"><Icon name="lucide:file-text" size="34"/></div><div class="media-card__body"><strong :title="item.name">{{item.name}}</strong><small>{{Math.round(item.size/1024)}} KB</small><div class="media-card__actions"><button class="btn btn--secondary" @click="copy(item.url)">Copiar URL</button><button v-if="isAdmin" class="icon-button danger" @click="del(item)" aria-label="Eliminar"><Icon name="lucide:trash-2"/></button></div></div></article></section></div></template>
