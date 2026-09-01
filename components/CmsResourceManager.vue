<script setup lang="ts">
import { mediaService } from '~/modules/media/service/media.service'

type SelectOption = string | number | boolean | { value: string | number | boolean; label: string }
interface Field {
  key: string
  label: string
  type?: 'text'|'date'|'time'|'datetime-local'|'textarea'|'number'|'select'|'array'|'image'|'image-multi'|'email'|'password'
  options?: SelectOption[]
  placeholder?: string
  required?: boolean
  filterable?: boolean
  defaultValue?: any
  autoIncrement?: boolean
  hint?: string
  readonly?: boolean
}
interface ResourceService {
  list(): Promise<any[]>
  create(payload:any): Promise<any>
  update(id:string|number,payload:any): Promise<any>
  remove(id:string|number): Promise<void>
}
const props=withDefaults(defineProps<{
  service: ResourceService
  title: string
  description: string
  fields: Field[]
  columns?: string[]
  publishKey?: string
  showSearch?: boolean
  allowCreate?: boolean
  allowEdit?: boolean
  allowDelete?: boolean
  panelNote?: string
  emptyText?: string
  defaultFilters?: Record<string, any>
}>(), { publishKey: 'status', showSearch: true, allowCreate: true, allowEdit: true, allowDelete: true, panelNote: 'As alterações guardadas aqui são refletidas no site público.', emptyText: 'Adiciona o primeiro registo para começar.', defaultFilters: () => ({}) })

const route=useRoute()
const router=useRouter()
const items=ref<any[]>([])
const pending=ref(false)
const error=ref('')
const toast=useToast()
const confirmDialog=useConfirm()
const { user }=useAuth()
const isAdmin=computed(()=>user.value?.role==='admin')
const isViewer=computed(()=>user.value?.role==='viewer')
const canCreate=computed(()=>props.allowCreate && isAdmin.value)
const canEdit=computed(()=>props.allowEdit && (isAdmin.value || isViewer.value))
const canDelete=computed(()=>props.allowDelete && isAdmin.value)
const query=ref('')
const page=ref(1)
const pageSize=10
const filters=ref<Record<string, any>>(
  Object.fromEntries(
    props.fields
      .filter(f=>f.filterable)
      .map(f=>[f.key, props.defaultFilters?.[f.key] ?? ''])
  )
)
const editing=ref<any|null>(null)
const editingId=ref<string|number|null>(null)
const modalOpen=ref(false)
const saving=ref(false)
const uploadBusy=ref<Record<string,boolean>>({})
const localImagePreviews=ref<Record<string,string>>({})

const visibleColumns=computed(()=>props.columns?.length?props.columns:props.fields.slice(0,4).map(f=>f.key))
const filterFields=computed(()=>props.fields.filter(f=>f.filterable))
const isPublishable=computed(()=>props.fields.some(f=>f.key===props.publishKey))

const normalizedOption=(option:SelectOption)=> typeof option==='object' && option!==null && 'value' in option
  ? option
  : { value: option, label: String(option) }
const optionLabel=(field:Field,value:any)=>{
  const match=(field.options||[]).map(normalizedOption).find(o=>String(o.value)===String(value))
  return match?.label ?? value
}
const fieldLabel=(key:string)=>props.fields.find(f=>f.key===key)?.label||key
const toLocalDateTimeInput=(value:any)=>{
  if(!value) return ''
  const date=new Date(value)
  if(Number.isNaN(date.getTime())) return String(value).slice(0,16)
  const offset=date.getTimezoneOffset()*60000
  return new Date(date.getTime()-offset).toISOString().slice(0,16)
}
const formatDateTime=(value:any)=>{
  if(!value) return '—'
  const date=new Date(value)
  if(Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-PT',{dateStyle:'short',timeStyle:'short'}).format(date)
}
const display=(item:any,key:string)=>{
  const v=item[key]
  const field=props.fields.find(f=>f.key===key)
  if(field?.type==='image-multi' && Array.isArray(v)) return `${v.length} ${v.length===1?'imagem':'imagens'}`
  if(Array.isArray(v)) return v.join(' · ')
  if(field?.type==='select') return optionLabel(field,v)
  if(field?.type==='datetime-local') return formatDateTime(v)
  if(typeof v==='boolean') return v?'Sim':'Não'
  return v??'—'
}

const isImageColumn=(key:string)=>props.fields.find(f=>f.key===key)?.type==='image'
const imagePreviewFor=(field:Field)=>localImagePreviews.value[field.key]||editing.value?.[field.key]||''
const revokeLocalPreviews=()=>{
  for(const url of Object.values(localImagePreviews.value)){
    if(url?.startsWith('blob:')) URL.revokeObjectURL(url)
  }
  localImagePreviews.value={}
}

const filteredItems=computed(()=>{
  const q=query.value.trim().toLowerCase()
  return items.value.filter(item=>{
    if(q && !Object.values(item).some(v=>String(Array.isArray(v)?v.join(' '):v??'').toLowerCase().includes(q))) return false
    for(const field of filterFields.value){
      const selected=filters.value[field.key]
      if(selected!==undefined && selected!==null && selected!=='' && String(item[field.key]??'')!==String(selected)) return false
    }
    return true
  })
})

const totalPages=computed(()=>Math.max(1,Math.ceil(filteredItems.value.length/pageSize)))
const paginatedItems=computed(()=>{
  const safePage=Math.min(Math.max(1,page.value),totalPages.value)
  const start=(safePage-1)*pageSize
  return filteredItems.value.slice(start,start+pageSize)
})

watch([query,filters],()=>{ page.value=1 },{deep:true})
watch(totalPages,(total)=>{ if(page.value>total) page.value=total })

async function load(){
  pending.value=true; error.value=''
  try{ items.value=await props.service.list() }
  catch(e:any){ const message=e?.data?.message||e?.message||'Erro ao carregar os dados.'; error.value=message; toast.error('Não foi possível carregar', message) }
  finally{ pending.value=false }
}
function empty(){
  return Object.fromEntries(props.fields.map(f=>{
    if(f.autoIncrement){
      const max=Math.max(0,...items.value.map(item=>Number(item[f.key]||0)).filter(Number.isFinite))
      return [f.key,max+1]
    }
    if(f.defaultValue!==undefined) return [f.key,typeof f.defaultValue==='function'?f.defaultValue():f.defaultValue]
    return [f.key,['array','image-multi'].includes(f.type||'')?[]:'']
  }))
}
function create(){
  if(!canCreate.value) return
  revokeLocalPreviews()
  editingId.value=null
  editing.value=empty()
  modalOpen.value=true
  error.value=''
}
function edit(item:any){
  if(!canEdit.value) return
  revokeLocalPreviews()
  editingId.value=item.id
  editing.value=JSON.parse(JSON.stringify(item))
  for(const field of props.fields){
    if(field.type==='datetime-local') editing.value[field.key]=toLocalDateTimeInput(editing.value[field.key])
  }
  modalOpen.value=true
  error.value=''
}
function close(){
  revokeLocalPreviews()
  modalOpen.value=false
  editing.value=null
  editingId.value=null
  error.value=''
  if(route.query.new) router.replace({query:{...route.query,new:undefined}})
}
function validate(payload:any){
  for(const f of props.fields){
    if(f.required===false) continue
    if(['text','email','password','date','time','datetime-local','select'].includes(f.type||'text') && !String(payload[f.key]??'').trim()) return `${f.label} é obrigatório.`
    if(['array','image-multi'].includes(f.type||'') && (!Array.isArray(payload[f.key]) || !payload[f.key].filter(Boolean).length)) return `${f.label} é obrigatório.`
  }
  return ''
}
async function submit(){
  if(!editing.value) return
  const payload={...editing.value}
  delete payload.id
  delete payload.createdAt
  delete payload.updatedAt
  for(const f of props.fields){
    if(f.type==='array'&&typeof payload[f.key]==='string') payload[f.key]=payload[f.key].split('\n').map((x:string)=>x.trim()).filter(Boolean)
    if(f.type==='number'&&payload[f.key]!==''&&payload[f.key]!=null) payload[f.key]=Number(payload[f.key])
    if(f.type==='datetime-local') payload[f.key]=payload[f.key]?new Date(payload[f.key]).toISOString():null
  }
  const validation=validate(payload)
  if(validation){ error.value=validation; toast.warning('Verifica o formulário', validation); return }
  saving.value=true; error.value=''
  try{
    if(editingId.value!==null) await props.service.update(editingId.value,payload)
    else await props.service.create(payload)
    await load()
    const wasEditing=editingId.value!==null
    close()
    toast.success(
      wasEditing ? 'Alterações guardadas' : 'Registo adicionado',
      wasEditing ? 'O registo foi atualizado com sucesso.' : 'O novo registo foi criado com sucesso.'
    )
  }catch(e:any){
    const message=e?.data?.message||e?.message||'Não foi possível guardar as alterações.'
    error.value=message
    toast.error('Erro ao guardar', message)
  }finally{ saving.value=false }
}
async function del(item:any){
  if(!canDelete.value) return
  const label = display(item, visibleColumns.value[0])
  const accepted = await confirmDialog.ask({
    title: 'Eliminar registo?',
    message: label && label !== '—'
      ? `Vais eliminar “${label}”. Esta ação não pode ser anulada.`
      : 'Este registo será eliminado de forma permanente. Esta ação não pode ser anulada.',
    confirmLabel: 'Sim, eliminar',
    cancelLabel: 'Cancelar',
    tone: 'danger',
  })
  if(!accepted) return
  error.value=''
  try{
    await props.service.remove(item.id)
    await load()
    toast.success('Registo eliminado', 'O registo foi removido com sucesso.')
  }
  catch(e:any){
    const message=e?.data?.message||e?.message||'Não foi possível eliminar o registo.'
    error.value=message
    toast.error('Erro ao eliminar', message)
  }
}
async function togglePublish(item:any){
  if(!canEdit.value) return
  const key=props.publishKey
  const current=item[key]
  const next=current==='draft'?'published':'draft'
  try{
    await props.service.update(item.id,{...item,[key]:next})
    await load()
    if(next==='draft') toast.info('Conteúdo despublicado', 'O conteúdo deixou de estar visível no site público.')
    else if(item.publishedAt && new Date(item.publishedAt).getTime()>Date.now()) toast.success('Publicação agendada', `O conteúdo será publicado em ${formatDateTime(item.publishedAt)}.`)
    else toast.success('Conteúdo publicado', 'O conteúdo já está disponível no site público.')
  }catch(e:any){
    const message=e?.data?.message||e?.message||'Não foi possível alterar o estado de publicação.'
    error.value=message
    toast.error('Erro ao alterar publicação', message)
  }
}
function arrayInput(key:string,event:Event){ editing.value[key]=(event.target as HTMLTextAreaElement).value }
async function uploadImage(field:Field,event:Event){
  const input=event.target as HTMLInputElement
  const file=input.files?.[0]
  if(!file)return

  const previous=localImagePreviews.value[field.key]
  if(previous?.startsWith('blob:')) URL.revokeObjectURL(previous)
  localImagePreviews.value[field.key]=URL.createObjectURL(file)

  uploadBusy.value[field.key]=true
  error.value=''
  try{
    const media=mediaService()
    const result=await media.upload(file)
    editing.value[field.key]=result.url
    toast.success('Imagem carregada', 'Confirma a pré-visualização e guarda o registo para aplicar a alteração.')
  }catch(e:any){
    const preview=localImagePreviews.value[field.key]
    if(preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    delete localImagePreviews.value[field.key]
    error.value=e?.data?.message||e?.message||'Não foi possível carregar a imagem.'
    toast.error('Erro no upload', error.value)
  }finally{
    uploadBusy.value[field.key]=false
    input.value=''
  }
}
function clearImage(field:Field){
  const preview=localImagePreviews.value[field.key]
  if(preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
  delete localImagePreviews.value[field.key]
  if(editing.value) editing.value[field.key]=''
}
function clearFilters(){
  query.value=''
  filters.value=Object.fromEntries(filterFields.value.map(f=>[f.key,'']))
  page.value=1
}
onMounted(async()=>{ await load(); if(route.query.new==='1' && canCreate.value) create() })
onBeforeUnmount(revokeLocalPreviews)
</script>

<template>
  <div class="page-stack">
    <header class="page-heading">
      <div><p class="eyebrow">AM Moreira · Gestão</p><h1>{{title}}</h1><p class="page-heading__description">{{description}}</p></div>
      <div v-if="canCreate" class="page-heading__actions"><button class="btn btn--primary" @click="create"><Icon name="lucide:plus"/> Adicionar</button></div>
    </header>

    <p v-if="error" class="cms-alert cms-alert--danger">{{error}}</p>

    <section class="panel content-panel">
      <div class="panel__header content-panel__header">
        <div><h2>{{filteredItems.length}} de {{items.length}} registos</h2><p>{{ panelNote }}</p></div>
        <div class="resource-tools">
          <label v-if="showSearch" class="resource-search"><Icon name="lucide:search"/><input v-model="query" type="search" placeholder="Pesquisar…"></label>
          <label v-for="field in filterFields" :key="field.key" class="resource-filter-wrap">
            <span>{{ field.label }}</span>
            <select v-model="filters[field.key]" class="resource-filter" :aria-label="`Filtrar por ${field.label}`">
              <option value="">Todos</option>
              <option v-for="option in field.options" :key="String(normalizedOption(option).value)" :value="normalizedOption(option).value">{{normalizedOption(option).label}}</option>
            </select>
          </label>
          <button v-if="query || Object.values(filters).some(Boolean)" class="btn btn--ghost" @click="clearFilters"><Icon name="lucide:x"/> Limpar</button>
          <button class="btn btn--secondary" @click="load" :disabled="pending"><Icon name="lucide:refresh-cw"/> Atualizar</button>
        </div>
      </div>

      <div v-if="pending" class="cms-loading">A carregar…</div>
      <div v-else-if="!filteredItems.length" class="empty-state"><Icon name="lucide:inbox" size="30"/><h3>{{query||Object.values(filters).some(Boolean)?'Sem resultados':'Ainda não existem registos'}}</h3><p>{{query||Object.values(filters).some(Boolean)?'Altera a pesquisa ou os filtros.':emptyText}}</p><button v-if="canCreate&&!query&&!Object.values(filters).some(Boolean)" class="btn btn--primary" @click="create">Adicionar registo</button></div>
      <div v-else class="table-scroll">
        <table class="data-table resource-data-table"><thead><tr><th v-for="c in visibleColumns" :key="c">{{fieldLabel(c)}}</th><th>Ações</th></tr></thead>
          <tbody><tr v-for="item in paginatedItems" :key="item.id">
            <td v-for="c in visibleColumns" :key="c" :data-label="fieldLabel(c)">
              <img v-if="isImageColumn(c) && item[c]" :src="item[c]" :alt="`Imagem de ${display(item,visibleColumns[0])}`" class="table-image-preview" loading="lazy">
              <strong v-else-if="c===visibleColumns[0]">{{display(item,c)}}</strong>
              <template v-else>{{display(item,c)}}</template>
            </td>
            <td data-label="Ações"><div class="row-actions">
              <button v-if="isPublishable && canEdit" class="icon-button icon-button--small" @click="togglePublish(item)" :title="item[publishKey]==='draft'?'Publicar':'Despublicar'"><Icon :name="item[publishKey]==='draft'?'lucide:eye':'lucide:eye-off'"/></button>
              <button v-if="canEdit" class="icon-button icon-button--small" @click="edit(item)" title="Editar"><Icon name="lucide:pencil"/></button>
              <button v-if="canDelete" class="icon-button icon-button--small danger" @click="del(item)" title="Eliminar"><Icon name="lucide:trash-2"/></button>
            </div></td>
          </tr></tbody>
        </table>
      </div>

      <CmsPagination
        v-model:page="page"
        :total-items="filteredItems.length"
        :page-size="pageSize"
      />
    </section>

    <div v-if="modalOpen" class="modal-backdrop" @click.self="close">
      <form v-if="editing" class="cms-modal" @submit.prevent="submit">
        <header><div><p class="eyebrow">{{editingId!==null?'Editar registo':'Novo registo'}}</p><h2>{{title}}</h2></div><button type="button" class="icon-button" @click="close"><Icon name="lucide:x"/></button></header>
        <div class="form-grid">
          <label v-for="field in fields" :key="field.key" class="form-field" :class="{'form-field--wide':['textarea','array','image','image-multi'].includes(field.type||'')}">
            <span>{{field.label}}</span>
            <textarea v-if="field.type==='textarea'" v-model="editing[field.key]" rows="5" :placeholder="field.placeholder" :readonly="field.readonly"/>
            <textarea v-else-if="field.type==='array'" :value="Array.isArray(editing[field.key])?editing[field.key].join('\n'):editing[field.key]" rows="5" placeholder="Um item por linha" @input="arrayInput(field.key,$event)"/>
            <select v-else-if="field.type==='select'" v-model="editing[field.key]" :disabled="field.readonly"><option value="">Selecionar…</option><option v-for="option in field.options" :key="String(normalizedOption(option).value)" :value="normalizedOption(option).value">{{normalizedOption(option).label}}</option></select>
            <CmsDateTimePicker
              v-else-if="['date','time','datetime-local'].includes(field.type||'')"
              v-model="editing[field.key]"
              :type="field.type as 'date'|'time'|'datetime-local'"
              :required="field.required!==false"
              :readonly="field.readonly"
              :placeholder="field.placeholder"
            />
            <CmsGalleryImagePicker
              v-else-if="field.type==='image-multi'"
              v-model="editing[field.key]"
            />
            <template v-else-if="field.type==='image'">
              <div class="image-field">
                <div v-if="imagePreviewFor(field)" class="image-preview-card">
                  <img :src="imagePreviewFor(field)" :alt="`Pré-visualização de ${field.label}`" class="image-preview">
                  <div class="image-preview-card__meta">
                    <span>{{ localImagePreviews[field.key] ? 'Nova imagem selecionada' : 'Imagem atual' }}</span>
                    <a v-if="editing[field.key] && !localImagePreviews[field.key]" :href="editing[field.key]" target="_blank" rel="noopener">Abrir imagem</a>
                  </div>
                </div>
                <div v-else class="image-preview-empty">
                  <Icon name="lucide:image" size="28"/>
                  <span>Ainda não existe imagem.</span>
                </div>
                <input v-model="editing[field.key]" type="text" :placeholder="field.placeholder||'URL ou caminho da imagem'">
                <label class="image-upload-button" :class="{'is-loading':uploadBusy[field.key]}">
                  <Icon :name="uploadBusy[field.key]?'lucide:loader-circle':'lucide:upload'" />
                  {{ uploadBusy[field.key] ? 'A carregar…' : imagePreviewFor(field) ? 'Substituir imagem' : 'Carregar imagem' }}
                  <input type="file" accept="image/*" hidden :disabled="uploadBusy[field.key]" @change="uploadImage(field,$event)">
                </label>
                <button v-if="imagePreviewFor(field)" type="button" class="btn btn--ghost image-remove-button" :disabled="uploadBusy[field.key]" @click="clearImage(field)">
                  <Icon name="lucide:x"/> Remover imagem
                </button>
                <small class="form-field__hint">A pré-visualização é atualizada assim que selecionas o ficheiro. O URL final é guardado no MongoDB depois de guardares o registo.</small>
              </div>
            </template>
            <input v-else v-model="editing[field.key]" :type="field.type||'text'" :placeholder="field.placeholder" :required="field.required!==false" :readonly="field.readonly"/>
            <small v-if="field.hint" class="form-field__hint">{{field.hint}}</small>
          </label>
        </div>
        <footer><button type="button" class="btn btn--secondary" @click="close">Cancelar</button><button class="btn btn--primary" :disabled="saving">{{saving?'A guardar…':editingId!==null?'Guardar alterações':'Adicionar registo'}}</button></footer>
      </form>
    </div>
  </div>
</template>
