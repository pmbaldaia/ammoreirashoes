const valueLabels: Record<string, string> = {
  active: 'Ativo', inactive: 'Inativo', enabled: 'Ativo', disabled: 'Inativo',
  pending: 'Pendente', draft: 'Rascunho', published: 'Publicado', archived: 'Arquivado',
  cancelled: 'Cancelado', canceled: 'Cancelado', upcoming: 'Próxima', ongoing: 'A decorrer',
  finished: 'Terminada', new: 'Novo', reviewing: 'Em análise', contacted: 'Contactado',
  resolved: 'Resolvido', closed: 'Fechado', hidden: 'Oculto', visible: 'Visível',
  admin: 'Administrador', viewer: 'Consulta e edição', commercial: 'Comercial',
  create: 'Criação', update: 'Atualização', delete: 'Eliminação',
  pages: 'Páginas', contentBlocks: 'Blocos de conteúdo', products: 'Produtos', categories: 'Categorias',
  collections: 'Coleções', events: 'Feiras e eventos', gallery: 'Galeria', contacts: 'Contactos',
  menus: 'Menus', settings: 'Informação da empresa', auditLogs: 'Histórico de alterações', users: 'Utilizadores', media: 'Multimédia',
  website: 'Website', cms: 'CMS', header: 'Cabeçalho', footer: 'Rodapé',
  home: 'Início', inicio: 'Início', sobre: 'Sobre nós', contacto: 'Contactos', contactos: 'Contactos',
  produtos: 'Produtos', colecoes: 'Coleções', eventos: 'Feiras e eventos', galeria: 'Galeria',
}

const keyLabels: Record<string, string> = {
  createdAt: 'Criado em', updatedAt: 'Atualizado em', status: 'Estado',
  actorName: 'Utilizador', resourceId: 'Identificador', pageSlug: 'Página',
}

export function cmsValueLabel(value: unknown) {
  if (value === true) return 'Sim'
  if (value === false) return 'Não'
  const key = String(value ?? '')
  return valueLabels[key] ?? value
}

export function cmsKeyLabel(key: string) {
  return keyLabels[key] ?? key
}

export function cmsStatusTone(value: unknown): 'success' | 'warning' | 'danger' | 'info' {
  const key = String(value ?? '')
  if (['active','published','resolved','finished','visible'].includes(key)) return 'success'
  if (['pending','draft','upcoming','reviewing','ongoing'].includes(key)) return 'warning'
  if (['inactive','cancelled','canceled'].includes(key)) return 'danger'
  return 'info'
}
