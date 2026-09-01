import type { CrudRepository } from './rest.repository'
export const createCrudService = <T extends { id?: string | number }>(repository: CrudRepository<T>) => ({
  list: () => repository.list(),
  create: (payload: Partial<T>) => repository.create(payload),
  update: (id: string | number, payload: Partial<T>) => repository.update(id, payload),
  remove: (id: string | number) => repository.remove(id)
})
