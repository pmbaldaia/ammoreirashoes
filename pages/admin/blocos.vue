<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const service = useResourceService('contentBlocks')
const componentTypes = [
  { value: 'hero', label: 'Secção principal' },
  { value: 'page-header', label: 'Cabeçalho da página' },
  { value: 'text', label: 'Texto' },
  { value: 'text-image', label: 'Texto com imagem' },
  { value: 'image-text', label: 'Imagem com texto' },
  { value: 'gallery', label: 'Galeria' },
  { value: 'grid', label: 'Grelha de conteúdos' },
  { value: 'products', label: 'Produtos' },
  { value: 'collections', label: 'Coleções' },
  { value: 'events', label: 'Feiras e eventos' },
  { value: 'video', label: 'Vídeo' },
  { value: 'highlight', label: 'Destaque' },
  { value: 'cta', label: 'Chamada à ação' },
  { value: 'form', label: 'Formulário' },
  { value: 'contacts', label: 'Contactos' },
]
const fields = [{ key: 'pageSlug', label: 'Página' }, { key: 'type', label: 'Tipo de componente', type: 'select', filterable: true, options: componentTypes }, { key: 'eyebrow', label: 'Antetítulo', required: false }, { key: 'title', label: 'Título', required: false }, { key: 'content', label: 'Conteúdo', type: 'textarea', required: false }, { key: 'image', label: 'Imagem', type: 'image', required: false }, { key: 'items', label: 'Itens / referências', type: 'array', required: false, hint: 'Botões: Texto|/destino. Um item por linha.' }, { key: 'desktopColumns', label: 'Colunas desktop', type: 'number', defaultValue: 3 }, { key: 'tabletColumns', label: 'Colunas tablet', type: 'number', defaultValue: 2 }, { key: 'mobileColumns', label: 'Colunas mobile', type: 'number', defaultValue: 1 }, { key: 'order', label: 'Ordem', type: 'number', defaultValue: 1 }, { key: 'status', label: 'Estado', type: 'select', options: [{ value: 'published', label: 'Visível' }, { value: 'draft', label: 'Oculto' }], defaultValue: 'published' }]
</script>
<template><CmsResourceManager :service="service" title="Blocos de conteúdo" description="Adiciona, edita, duplica e ordena blocos responsivos." :fields="fields" :columns="['pageSlug','type','title','order','status']"/></template>
