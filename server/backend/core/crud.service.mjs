export function createCrudService(repository, { normalize = (value) => value, publicFilter = (row) => row.status !== 'draft' } = {}) {
  return {
    list: () => repository.readAll(),
    async listPublic() { return (await repository.readAll()).filter(publicFilter) },
    get: (id) => repository.findById(id),
    async getPublic(id) {
      const row = await repository.findById(id)
      return row && publicFilter(row) ? row : null
    },
    create: (payload) => repository.create(normalize(payload)),
    update: (id, payload) => repository.update(id, normalize(payload)),
    remove: (id) => repository.remove(id)
  }
}
