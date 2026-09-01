import { createRestRepository } from '~/modules/core/repository/rest.repository'
export const usersRepository=()=>createRestRepository<any>('users')
