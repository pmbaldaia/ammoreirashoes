export function createCrudService(repository, { normalize = (value) => value, publicFilter = (row) => row.status !== 'draft' } = {}) {
  return {
    list: () => repository.readAll(),
    async listPublic() { return (await repository.readAll()).filter(publicFilter) },
    get: (id) => repository.findById(id),
    create: (payload) => repository.create(normalize(payload)),
    update: (id, payload) => repository.update(id, normalize(payload)),
    remove: (id) => repository.remove(id)
  }
}
