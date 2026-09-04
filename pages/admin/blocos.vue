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
const fields = [{ key: 'pageSlug', label: 'Página', hint: 'Indica a página onde este bloco é apresentado.' }, { key: 'type', label: 'Tipo de bloco', type: 'select', filterable: true, options: componentTypes }, { key: 'eyebrow', label: 'Antetítulo', required: false }, { key: 'title', label: 'Título', required: false }, { key: 'content', label: 'Conteúdo', type: 'textarea', required: false }, { key: 'image', label: 'Imagem', type: 'image', required: false }, { key: 'items', label: 'Botões / ações', type: 'buttons', required: false, hint: 'Adiciona os botões deste bloco e escolhe o estilo de cada um.' }, { key: 'order', label: 'Posição na página', type: 'number', defaultValue: 1 }, { key: 'status', label: 'Visibilidade', type: 'select', options: [{ value: 'published', label: 'Visível no site' }, { value: 'draft', label: 'Oculto no site' }], defaultValue: 'published' }]
</script>
<template><CmsResourceManager :service="service" title="Blocos de conteúdo" description="Organiza o conteúdo de cada página. A adaptação a telemóvel, tablet e computador é automática." :fields="fields" :columns="['pageSlug','type','title','order','status']" inline-editor/></template>
