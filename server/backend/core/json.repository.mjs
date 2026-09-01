/**
 * Repositório legado mantido apenas para referência da migração.
 * A aplicação usa MongoDB através de mongo.repository.mjs.
 */
export function createJsonRepository() {
  throw new Error('Persistência JSON desativada. Utilize MongoDB.')
}
