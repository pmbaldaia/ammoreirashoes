import { createMongoRepository } from './mongo.repository.mjs'
import { createCrudService } from './crud.service.mjs'

const resources = ['pages','contentBlocks','products','categories','collections','events','gallery','contacts','menus','settings','auditLogs']
export const amServices = Object.fromEntries(resources.map((resource) => [resource, createCrudService(createMongoRepository(resource), {
  normalize: (payload = {}) => ({ ...payload }),
  publicFilter: (row) => ['published','active','upcoming','ongoing','finished'].includes(row.status) || row.public === true,
})]))

export async function audit(user, action, resource, resourceId, metadata = {}) {
  return amServices.auditLogs.create({
    actorId: user?.id || 'public', actorName: user?.name || 'Visitante', action, resource,
    resourceId: resourceId || null, metadata, createdAt: new Date().toISOString(), status: 'active',
  })
}
