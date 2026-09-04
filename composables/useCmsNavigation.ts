export interface CmsNavItem {
  label: string
  icon: string
  to: string
  adminOnly?: boolean
}

export interface CmsNavGroup {
  label: string
  items: CmsNavItem[]
}

const allGroups: CmsNavGroup[] = [
  { label: 'Geral', items: [
    { label: 'Painel de controlo', icon: 'lucide:layout-dashboard', to: '/admin' },
  ]},
  { label: 'Conteúdo', items: [
    { label: 'Páginas', icon: 'lucide:file-text', to: '/admin/paginas' },
    { label: 'Blocos de conteúdo', icon: 'lucide:blocks', to: '/admin/blocos' },
    { label: 'Menus', icon: 'lucide:menu', to: '/admin/menus' },
  ]},
  { label: 'Catálogo', items: [
    { label: 'Produtos', icon: 'lucide:footprints', to: '/admin/produtos' },
    { label: 'Categorias', icon: 'lucide:tags', to: '/admin/categorias' },
    { label: 'Coleções', icon: 'lucide:book-open', to: '/admin/colecoes' },
  ]},
  { label: 'Comunicação', items: [
    { label: 'Feiras e eventos', icon: 'lucide:calendar-days', to: '/admin/eventos' },
    { label: 'Galeria', icon: 'lucide:images', to: '/admin/galeria' },
    { label: 'Contactos', icon: 'lucide:messages-square', to: '/admin/contactos' },
  ]},
  { label: 'Biblioteca', items: [
    { label: 'Multimédia', icon: 'lucide:image', to: '/admin/media' },
  ]},
  { label: 'Sistema', items: [
    { label: 'Utilizadores', icon: 'lucide:key-round', to: '/admin/utilizadores', adminOnly: true },
    { label: 'Informação da empresa', icon: 'lucide:settings-2', to: '/admin/definicoes' },
    { label: 'Histórico de alterações', icon: 'lucide:scroll-text', to: '/admin/logs', adminOnly: true },
  ]},
]

export const useCmsNavigation = () => {
  const { user } = useAuth()

  const groups = computed<CmsNavGroup[]>(() =>
    allGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => !item.adminOnly || user.value?.role === 'admin'),
      }))
      .filter(group => group.items.length),
  )

  return { groups }
}
